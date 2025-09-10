import "dotenv/config";

export type TaskMessage = {
  taskId: number;
  action: string;
  payload?: Record<string, unknown>;
};

export const RABBIT_URL = process.env.RABBIT_URL || "";
export const QUEUE = process.env.QUEUE_NAME || "tasks";