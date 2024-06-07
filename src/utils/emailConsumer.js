import { consume } from '../config/rabbitmq';
import {sendNotification} from '../utils/sendEmail';
import logger from '../config/logger';

async function handleEmailQueue(message) {
  try {
    const data = message;
    await sendNotification(data);
    console.log('==============sent======================');
    logger.info(`Email sent to ${data.email}`);
  } catch (error) {
    logger.error(`Failed to send email: ${error.message}`);
  }
}

export function startEmailConsumer() {
  console.log('-------------------------started---------------------');
  consume('User', handleEmailQueue);
}
