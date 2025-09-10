import { TaskMessage, QUEUE } from "./types";
import { createConnection } from "./connection";

async function produce(message: TaskMessage): Promise<void> {
  let conn: any = null;
  let ch: any = null;

  try {
    conn = await createConnection();
    ch = await conn.createChannel();

    // Ensure queue exists and is durable
    await ch.assertQueue(QUEUE, { durable: true });
    console.log(`📋 Queue "${QUEUE}" is ready`);

    const buffer = Buffer.from(JSON.stringify(message));
    const sent = ch.sendToQueue(QUEUE, buffer, { persistent: true });
    
    if (sent) {
      console.log("📤 Message sent successfully:", message);
    } else {
      console.warn("⚠️ Message was not sent (queue might be full)");
    }
  } catch (err) {
    console.error("❌ Producer error:", err);
    throw err;
  } finally {
    // Close resources cleanly
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
      console.error("Error closing resources:", e);
    }
  }
}

produce({
  taskId: new Date().getTime(),
  action: "create",
  payload: {
    name: "Misbah",
    email: "misbah@gmail.com",
  },
});
