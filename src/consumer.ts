import { TaskMessage, QUEUE } from "./types";
import { createConnection } from "./connection";

async function startConsumer(): Promise<void> {
  let conn: any = null;
  let ch: any = null;

  try {
    conn = await createConnection();
    ch = await conn.createChannel();

    // Make queue durable (match producer)
    await ch.assertQueue(QUEUE, { durable: true });
    console.log(`📋 Queue "${QUEUE}" is ready`);

    // Fair dispatch: do not give more than 1 unacked message to a worker
    ch.prefetch(1);
    console.log("⚙️ Prefetch set to 1 message per consumer");

    console.log(`📥 Consumer started — waiting for messages in "${QUEUE}"`);

    const onMessage = async (msg: any) => {
      if (!msg) return;

      try {
        const content = JSON.parse(msg.content.toString()) as TaskMessage;
        console.log("✅ Received:", content);

        // Simulate processing logic — replace with real work
        await handleTask(content);

        ch.ack(msg);
        console.log("✔️ Acked:", content.taskId);
      } catch (err) {
        console.error("❌ Processing error:", err);

        // Option A: reject and requeue (true) — careful: might loop forever
        // ch.nack(msg, false, true);

        // Option B: reject and drop (false) or place into a DLQ by exchange/headers (recommended for production)
        ch.nack(msg, false, false);
        console.log("❌ Message rejected and dropped");
      }
    };

    ch.consume(QUEUE, onMessage, { noAck: false });
  } catch (err) {
    console.error("❌ Consumer startup error:", err);
    // in real systems: attempt reconnect with backoff
    process.exit(1);
  }

  // graceful shutdown
  const shutdown = async () => {
    console.log("⏳ Shutting down consumer...");
    try {
      if (ch) {
        await ch.close();
        console.log("🔒 Channel closed");
      }
      if (conn) {
        await conn.close();
        console.log("🔒 Connection closed");
      }
    } catch (e) {
      console.error("Error during shutdown:", e);
    } finally {
      process.exit(0);
    }
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

async function handleTask(task: TaskMessage): Promise<void> {
  // Replace with your actual task processing
  // Simulate variable work time:
  const workMs = 500 + Math.floor(Math.random() * 1500);
  await new Promise((res) => setTimeout(res, workMs));
  // Example: log the payload or do DB/network work here
  console.log(`   → processed ${task.action} (${task.taskId}) in ${workMs}ms`);
}

startConsumer();
