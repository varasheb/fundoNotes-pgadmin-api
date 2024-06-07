import { consume } from '../config/rabbitmq';
import { sendNotification } from '../utils/sendEmail';
import logger from '../config/logger';

async function handleEmailQueue(message) {
  try {
    const data = message;
    await sendNotification(data);
    logger.info(`Email sent to ${data.email}`);
  } catch (error) {
    logger.error(`Failed to send email: ${error.message}`);
  }
}

export function startEmailConsumer() {
  consume('User', handleEmailQueue);
}
