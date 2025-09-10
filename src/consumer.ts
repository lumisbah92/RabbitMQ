import { TaskMessage, QUEUE } from "./types";
import { createConnection } from "./connection";

async function startConsumer(): Promise<void> {
  try {
    const connection = await createConnection();
    const channel = await connection.createChannel();

    // Make queue durable (match producer)
    await channel.assertQueue(QUEUE, { durable: true });

    // Fair dispatch: do not give more than 1 unacked message to a worker
    channel.prefetch(1);

    // Consume messages from the queue
    channel.consume(QUEUE, (msg: any) => onMessage(msg), { noAck: false });
  } catch (err) {
    console.error("❌ Consumer startup error:", err);
  }
}

const onMessage = (message: TaskMessage) => {
  console.log("Message received:", message);
};

startConsumer();
