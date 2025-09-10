import "dotenv/config";
import amqp from "amqplib";
import { RABBIT_URL } from "./types";

export async function createConnection() {
  const connection = await amqp.connect(RABBIT_URL);
  return connection;
}