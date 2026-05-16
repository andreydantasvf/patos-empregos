import * as crypto from 'crypto';
import MercadoPagoConfig, { Payment } from 'mercadopago';
import { env } from '@/config/env';

export interface PixPaymentResponse {
  paymentId: string;
  qrCode: string;
  qrCodeBase64: string;
  amount: number;
}

export interface PaymentDetails {
  id: string;
  status: string;
}

export interface WebhookValidationParams {
  signature?: string;
  requestId?: string;
  dataId?: string;
}

export abstract class IPaymentProvider {
  abstract generatePixPayment(amount: number, description: string, payerEmail: string): Promise<PixPaymentResponse>;
  abstract getPaymentDetails(paymentId: string): Promise<PaymentDetails>;
  abstract validateWebhook(params: WebhookValidationParams): boolean;
}

export class MercadoPagoProvider implements IPaymentProvider {
  private client: MercadoPagoConfig;
  private paymentClient: Payment;

  constructor() {
    const token = env.TESTE_MERCADO_PAGO_ACCESS_TOKEN;
    if (!token) {
      throw new Error('TESTE_MERCADO_PAGO_ACCESS_TOKEN is not defined');
    }
    this.client = new MercadoPagoConfig({ accessToken: token });
    this.paymentClient = new Payment(this.client);
  }

  async generatePixPayment(amount: number, description: string, payerEmail: string): Promise<PixPaymentResponse> {
    const response = await this.paymentClient.create({
      body: {
        transaction_amount: amount,
        description,
        payment_method_id: 'pix',
        payer: {
          email: payerEmail,
        },
      },
    });

    return {
      paymentId: String(response.id),
      qrCode: response.point_of_interaction?.transaction_data?.qr_code || '',
      qrCodeBase64: response.point_of_interaction?.transaction_data?.qr_code_base64 || '',
      amount: response.transaction_amount || amount,
    };
  }

  async getPaymentDetails(paymentId: string): Promise<PaymentDetails> {
    const response = await this.paymentClient.get({ id: paymentId });
    return {
      id: String(response.id),
      status: response.status || 'pending',
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
    let ts = '';
    let v1 = '';
    for (const part of parts) {
      const [key, value] = part.split('=');
      if (key?.trim() === 'ts') ts = value?.trim();
      if (key?.trim() === 'v1') v1 = value?.trim();
    }

    if (!ts || !v1) return false;

    const manifest = `id:${params.dataId};request-id:${params.requestId};ts:${ts};`;
    const hmac = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

    return hmac === v1;
  }
}

export const paymentProvider = new MercadoPagoProvider();
