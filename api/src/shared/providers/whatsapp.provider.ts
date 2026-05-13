/**
 * WhatsApp Integration Provider (placeholder)
 *
 * This module is prepared for future integration with the WhatsApp Business API
 * or third-party providers such as Z-API, Twilio, or Evolution API.
 *
 * Planned features:
 *  - Send notification when a job is approved
 *  - Notify responsible person via WhatsApp
 *  - Automated job application via WhatsApp
 */

export interface WhatsAppMessage {
  to: string;
  body: string;
}

export const whatsappProvider = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendMessage(_message: WhatsAppMessage): Promise<void> {
    throw new Error('WhatsApp provider not yet implemented');
  },
};
