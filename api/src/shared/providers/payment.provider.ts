import { env } from '@/config/env';
import * as crypto from 'crypto';
import MercadoPagoConfig, { Order } from 'mercadopago';
import { AppError, NotFoundError } from '../errors';
import { logger } from '../utils/logger';

export interface PaymentRequest {
  transaction_amount: number;
  description: string;
  payer: {
    name: string;
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}

export interface PixPaymentResponse {
  preferenceId: string;
  qrCode: string;
  qrCodeBase64: string;
  ticketUrl: string;
}

export interface PaymentDetails {
  id: string;
  status: string;
  status_detail?: string;
  payment_status_detail?: string;
  transaction_amount: number;
  date_approved?: Date;
  date_created: Date;
}

export interface WebhookValidationParams {
  signature?: string;
  requestId?: string;
  dataId?: string;
}

export abstract class IPaymentProvider {
  abstract generatePixPayment(data: PaymentRequest): Promise<PixPaymentResponse>;
  abstract getPaymentDetails(paymentId: string): Promise<PaymentDetails>;
  abstract validateWebhook(params: WebhookValidationParams): boolean;
}

type MercadoPagoError = {
  message?: string;
  error?: string;
  error_message?: string;
  detail?: string;
  details?: unknown;
  body?: unknown;
  data?: unknown;
  cause?: unknown;
  status?: number;
  response?: {
    status?: number;
    data?: unknown;
  };
  api_response?: {
    status?: number;
  };
};

function getMercadoPagoErrorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const mpError = error as MercadoPagoError;
  return mpError.status ?? mpError.response?.status ?? mpError.api_response?.status;
}

function getMercadoPagoErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (!error || typeof error !== 'object') {
    return 'Erro desconhecido do Mercado Pago';
  }

  const mpError = error as MercadoPagoError;
  const candidates = [
    mpError.message,
    mpError.error,
    mpError.error_message,
    mpError.detail,
    typeof mpError.body === 'object' && mpError.body !== null
      ? ((
          mpError.body as {
            message?: string;
            error?: string;
            error_message?: string;
            detail?: string;
          }
        ).message ??
        (
          mpError.body as {
            message?: string;
            error?: string;
            error_message?: string;
            detail?: string;
          }
        ).error ??
        (
          mpError.body as {
            message?: string;
            error?: string;
            error_message?: string;
            detail?: string;
          }
        ).error_message ??
        (
          mpError.body as {
            message?: string;
            error?: string;
            error_message?: string;
            detail?: string;
          }
        ).detail)
      : undefined,
    typeof mpError.data === 'object' && mpError.data !== null
      ? ((
          mpError.data as {
            message?: string;
            error?: string;
            error_message?: string;
            detail?: string;
          }
        ).message ??
        (
          mpError.data as {
            message?: string;
            error?: string;
            error_message?: string;
            detail?: string;
          }
        ).error ??
        (
          mpError.data as {
            message?: string;
            error?: string;
            error_message?: string;
            detail?: string;
          }
        ).error_message ??
        (
          mpError.data as {
            message?: string;
            error?: string;
            error_message?: string;
            detail?: string;
          }
        ).detail)
      : undefined,
  ].filter(
    (candidate): candidate is string =>
      typeof candidate === 'string' && candidate.trim().length > 0,
  );

  if (candidates.length > 0) {
    return candidates[0];
  }

  try {
    return JSON.stringify(error);
  } catch {
    return 'Erro desconhecido do Mercado Pago';
  }
}

export class MercadoPagoProvider implements IPaymentProvider {
  private client: MercadoPagoConfig;
  private order: Order;

  constructor() {
    const token = env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!token) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN is not defined');
    }
    this.client = new MercadoPagoConfig({
      accessToken: token,
      options: {
        timeout: 10000,
        idempotencyKey: crypto.randomUUID(),
      },
    });
    this.order = new Order(this.client);
  }

  async generatePixPayment(data: PaymentRequest): Promise<PixPaymentResponse> {
    try {
      const response = await this.order.create({
        body: {
          type: 'online',
          processing_mode: 'automatic',
          total_amount: data.transaction_amount.toString(),
          external_reference: 'ext_ref_1234',
          payer: {
            first_name: data.payer.name,
            email: data.payer.email,
            // Descomentar depois
            // identification: {
            //   type: data.payer.identification.type,
            //   number: data.payer.identification.number
            // }
          },
          transactions: {
            payments: [
              {
                amount: data.transaction_amount.toString(),
                payment_method: {
                  id: 'pix',
                  type: 'bank_transfer',
                },
              },
            ],
          },
        },
      });

      if (!response) {
        throw new AppError('Erro ao criar pagamento PIX no Mercado Pago', 502);
      }

      return {
        preferenceId: String(response.id || ''),
        qrCode: response.transactions!.payments!.at(0)!.payment_method!.qr_code || '',
        qrCodeBase64: response.transactions!.payments!.at(0)!.payment_method!.qr_code_base64 || '',
        ticketUrl: response.transactions!.payments!.at(0)!.payment_method!.ticket_url || '',
      };
    } catch (error) {
      const status = getMercadoPagoErrorStatus(error);
      const message = getMercadoPagoErrorMessage(error);

      logger.error({ status, message, error }, '[MercadoPago] Falha ao criar pedido PIX');

      if (status === 401 || status === 403) {
        throw new AppError(
          'Falha ao autenticar no Mercado Pago. Verifique o access token, o ambiente e as permissões da conta.',
          502,
        );
      }

      throw new AppError(`Falha ao criar pagamento PIX no Mercado Pago: ${message}`, 502);
    }
  }

  async getPaymentDetails(paymentId: string): Promise<PaymentDetails> {
    const response = await this.order.get({ id: paymentId });
    if (!response) {
      throw new NotFoundError('Payment not found');
    }

    const payment = response.transactions?.payments?.[0];
    const orderStatus = response.status || 'created';
    const paymentStatusDetail = payment?.status_detail || undefined;

    return {
      id: response.id || paymentId,
      status: orderStatus,
      payment_status_detail: paymentStatusDetail,
      status_detail: paymentStatusDetail,
      transaction_amount: Number(response.total_amount || 0),
      date_approved:
        orderStatus === 'processed' && paymentStatusDetail === 'accredited'
          ? new Date()
          : undefined,
      date_created: new Date(response.created_date || new Date()),
    };
  }

  validateWebhook(params: WebhookValidationParams): boolean {
    const secret = env.MERCADO_PAGO_WEBHOOK_SECRET;
    if (!secret) {
      return true; // Se não houver secret configurado, ignora a validação da assinatura
    }

    if (!params.signature || !params.requestId || !params.dataId) {
      return false;
    }

    const parts = params.signature.split(',');
    const tsHeader = parts.find((p) => p.startsWith('ts='));
    const v1Header = parts.find((p) => p.startsWith('v1='));

    if (!tsHeader || !v1Header) {
      return false;
    }

    const ts = tsHeader.split('=')[1];
    const hash = v1Header.split('=')[1];

    // Usar data.id do query param se disponível, caso contrário do body
    // IMPORTANTE: converter para minúsculas conforme documentação do Mercado Pago
    const dataId = (params.dataId || '').toLowerCase();

    if (!dataId) {
      return false;
    }

    // Construir manifest conforme documentação do Mercado Pago
    // Formato: id:[data.id_url];request-id:[x-request-id_header];ts:[ts_header];
    const manifest = `id:${dataId};request-id:${params.requestId};ts:${ts};`;

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(manifest);
    const expectedHash = hmac.digest('hex');

    const isValid = hash === expectedHash;

    return isValid;
  }
}

export const paymentProvider = new MercadoPagoProvider();
