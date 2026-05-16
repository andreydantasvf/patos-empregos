import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

interface SendGroupMessageDTO {
  groupId: string;
  message: string;
}

const evolutionUrl = process.env.EVOLUTION_URL;
const evolutionApiKey = process.env.EVOLUTION_API_KEY;
const evolutionInstance = process.env.EVOLUTION_INSTANCE;

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
