import { TaskMessage, EXCHANGE, ROUTING_KEY } from "../types";
import { createConnection } from "../connection";

async function produce(): Promise<void> {
  try {
    const connection = await createConnection();
    console.log("✅ Producer connected to RabbitMQ");
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE, "direct", { durable: true });

    for (let i = 1; i <= 10; i++) {
      const msg: TaskMessage = { taskId: i, action: "processOrder" };
      const buffer = Buffer.from(JSON.stringify(msg));
      channel.publish(EXCHANGE, ROUTING_KEY, buffer, { persistent: true });
      console.log("📤 Published:", msg);
    }
  
    await channel.close();
    await connection.close();
  } catch (err) {
    console.error("❌ Producer error:", err);
    throw err;
  }
}

produce();
