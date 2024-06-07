import amqplib from 'amqplib'

const RABBITMQ_URL = 'amqp://localhost'; 

async function connect() {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    return { connection, channel };
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
    throw error;
  }
}

async function publish(queue, message) {
  const { connection, channel } = await connect();
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(message));
  console.log(`Message sent to queue ${queue}: ${message}`);
  setTimeout(() => {
    connection.close();
  }, 500);
}

async function consume(queue,handleEmailQueue) {
  const { connection, channel } = await connect();
  await channel.assertQueue(queue);
  channel.consume(queue, (msg) => {
    if (msg !== null) {
      console.log(`Message received from queue ${queue}: ${msg.content.toString()}`);
      handleEmailQueue(JSON.parse(msg.content.toString()));
      channel.ack(msg);
    }
  });
}

module.exports = { publish, consume };
