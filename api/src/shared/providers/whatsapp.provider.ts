import axios from 'axios';
import { env } from '../../config/env';
import { AppError } from '../errors/AppError';

interface SendGroupMessageDTO {
  groupId: string;
  message: string;
  imageUrl?: string;
}

export const whatsappProvider = {
  async sendGroupMessage({ groupId, message, imageUrl }: SendGroupMessageDTO): Promise<void> {
    if (!env.EVOLUTION_URL || !env.EVOLUTION_API_KEY || !env.EVOLUTION_INSTANCE) {
      throw new AppError('Envio para o WhatsApp indisponível: Evolution API não configurada', 503);
    }

    const headers = { apikey: env.EVOLUTION_API_KEY };

    if (imageUrl) {
      await axios.post(
        `${env.EVOLUTION_URL}/message/sendMedia/${env.EVOLUTION_INSTANCE}`,
        {
          number: groupId,
          mediatype: 'image',
          media: imageUrl,
          caption: message,
        },
        { headers },
      );
    } else {
      await axios.post(
        `${env.EVOLUTION_URL}/message/sendText/${env.EVOLUTION_INSTANCE}`,
        {
          number: groupId,
          text: message,
        },
        { headers },
      );
    }
  },
};
