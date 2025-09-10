import { TaskMessage, QUEUE } from "../types";
import { createConnection } from "../connection";

async function startConsumer(): Promise<void> {
  try {
    const connection = await createConnection();
    console.log("✅ Consumer connected to RabbitMQ");
    const channel = await connection.createChannel();

    // Make queue durable (match producer)
    await channel.assertQueue(QUEUE, { durable: true });

    // Fair dispatch: do not give more than 1 unacked message to a worker
    channel.prefetch(0);

    // Consume messages from the queue
    channel.consume(QUEUE, (msg: any) => onMessage(msg, channel), { noAck: false });
  } catch (err) {
    console.error("❌ Consumer startup error:", err);
  }
}

const onMessage = (message: any, channel: any) => {
  if (!message) return;

  try {
    const content = JSON.parse(message.content.toString()) as TaskMessage;
    console.log("✅ Received:", content);
    channel.ack(message);
    console.log("✔️ Acked:", content.taskId);
    console.log("--------------------------------------------------\n\n");
  } catch (err) {
    console.error("❌ Processing error:", err);
    channel.nack(message, false, false);;
  }
};

startConsumer();
