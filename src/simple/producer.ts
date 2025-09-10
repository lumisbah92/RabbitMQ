import { TaskMessage, QUEUE } from "../types";
import { createConnection } from "../connection";

async function produce(message: TaskMessage): Promise<void> {
  try {
    const connection = await createConnection();
    console.log("✅ Producer connected to RabbitMQ");
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE, { durable: true });

    const buffer = Buffer.from(JSON.stringify(message));
    const sent = channel.sendToQueue(QUEUE, buffer, { persistent: true });
    
    if (sent) {
      console.log("📤 Message sent successfully:", message);
    } else {
      console.warn("⚠️ Message was not sent (queue might be full)");
    }
    await channel.close();
    await connection.close();
  } catch (err) {
    console.error("❌ Producer error:", err);
    throw err;
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
