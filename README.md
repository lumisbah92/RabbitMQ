# RabbitMQ Learning Project

This project demonstrates basic RabbitMQ producer-consumer patterns using TypeScript and Node.js.

## Files Overview

- **`src/producer.ts`** - Sends messages to a RabbitMQ queue
- **`src/consumer.ts`** - Consumes messages from a RabbitMQ queue
- **`docker-compose.yml`** - Sets up RabbitMQ server with management UI

## Prerequisites

- Node.js and npm/pnpm
- Docker and Docker Compose

## Setup

1. **Start RabbitMQ server:**
   ```bash
   docker-compose up -d
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Access RabbitMQ Management UI:**
   - Open http://localhost:15672
   - Username: `admin`
   - Password: `admin`

## Running the Examples

### Start the Consumer (in one terminal):
```bash
pnpm run start:consumer
```

### Start the Producer (in another terminal):
```bash
pnpm run start:producer
```

## What You'll Learn

### Producer Features:
- ✅ Connection management with proper cleanup
- ✅ Queue declaration (durable queues)
- ✅ Message persistence
- ✅ Error handling and logging
- ✅ Resource cleanup

### Consumer Features:
- ✅ Fair message distribution (prefetch=1)
- ✅ Message acknowledgment
- ✅ Error handling with nack
- ✅ Graceful shutdown handling
- ✅ Task processing simulation

## Key RabbitMQ Concepts Demonstrated

1. **Queues**: Durable queues that survive broker restarts
2. **Message Persistence**: Messages survive broker restarts
3. **Acknowledgment**: Manual ack/nack for reliable processing
4. **Prefetch**: Fair distribution of work among consumers
5. **Connection Management**: Proper resource cleanup

## Message Flow

1. Producer creates a connection and channel
2. Producer declares a durable queue
3. Producer sends a message with persistence
4. Consumer connects and declares the same queue
5. Consumer sets prefetch to 1 for fair distribution
6. Consumer processes messages and acknowledges them
7. Both producer and consumer clean up resources properly

## Next Steps for Learning

- Try running multiple consumers to see load balancing
- Experiment with different message types
- Add error handling and retry logic
- Implement dead letter queues
- Explore exchanges and routing patterns