import axios from 'axios';
import { env } from '../../config/env';

interface SendGroupMessageDTO {
  groupId: string;
  message: string;
}

const evolutionUrl = env.EVOLUTION_URL;
const evolutionApiKey = env.EVOLUTION_API_KEY;
const evolutionInstance = env.EVOLUTION_INSTANCE;

export const whatsappProvider = {
  async sendGroupMessage({ groupId, message }: SendGroupMessageDTO): Promise<void> {
    if (!evolutionUrl || !evolutionApiKey || !evolutionInstance) {
      throw new Error('WhatsApp provider not yet implemented');
    }

    const response = await axios.post(
      `${evolutionUrl}/api/message/send-group/${evolutionInstance}`,
      {
        number: groupId,
        text: message,
      },
      {
        headers: {
          apikey: evolutionApiKey,
        },
      },
    );

    if (response.status !== 200) {
      throw new Error('Failed to send message');
    }
  },
};
