import "dotenv/config";
import amqp from "amqplib";
import { RABBIT_URL } from "./types";

export async function createConnection() {
  console.log("🔗 Connecting to RabbitMQ...", RABBIT_URL);
  const connection = await amqp.connect(RABBIT_URL);
  return connection;
}