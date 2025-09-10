import { TaskMessage,QUEUE, EXCHANGE, ROUTING_KEY } from "../types";
import { createConnection } from "../connection";

async function startConsumer(workerId: number): Promise<void> {
  try {
    const connection = await createConnection();
    console.log("✅ Consumer connected to RabbitMQ");
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE, "direct", { durable: true });

    const q = await channel.assertQueue(QUEUE, { durable: true });
    await channel.bindQueue(q.queue, EXCHANGE, ROUTING_KEY);

    channel.prefetch(1);

    // Consume messages from the queue
    channel.consume(q.queue, async (msg: any) => await onMessage(msg, channel, workerId));
  } catch (err) {
    console.error("❌ Consumer startup error:", err);
  }
}

const onMessage = async (message: any, channel: any, workerId: number) => {
  if (!message) return;

  try {
    const content = JSON.parse(message.content.toString()) as TaskMessage;
    console.log(`✅ Worker ${workerId} Received: `, content);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    channel.ack(message);
    console.log(`✔️ Worker ${workerId} Acked:`, content.taskId);
    console.log("--------------------------------------------------\n\n");
  } catch (err) {
    console.error("❌ Processing error:", err);
    channel.nack(message, false, false);
  }
};

startConsumer(1);
