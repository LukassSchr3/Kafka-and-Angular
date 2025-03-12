const express = require('express');
const cors = require('cors');
const { Kafka } = require('kafkajs');

const app = express();
app.use(cors());

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'my-group' });

// Declare "messages" once here
const messages = [];

(async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'my-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = message.value.toString();
      console.log(`Received message: ${data}`);
      messages.push(data);
    },
  });
})();

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
