export interface PixPaymentResponse {
  paymentId: string;
  qrCode: string;
  qrCodeBase64: string;
  amount: number;
}

export const paymentProvider = {
  async generatePixPayment(amount: number, description: string): Promise<PixPaymentResponse> {
    // Simulando chamada a uma API externa (como Abacate Pay)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          paymentId: `mock_pay_${Date.now()}`,
          qrCode: `00020101021226580014br.gov.bcb.pix0136mock-uuid-1234-5678-abcd-efgh5204000053039865405${amount.toFixed(2)}5802BR5911Empresa Mock6009Sao Paulo62070503***6304ABCD`,
          qrCodeBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', // mock base64 pixel
          amount,
        });
      }, 500);
    });
  },
};
