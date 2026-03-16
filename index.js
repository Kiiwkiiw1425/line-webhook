// index.js

// โหลด .env แบบ optional (กันพังบน Render)
try { require('dotenv').config(); } catch (e) {}

const express = require('express');
const bodyParser = require('body-parser');

const { handleTextMessage } = require('./handlers/messageHandler');
const { handlePostback } = require('./handlers/postbackHandler');

const app = express();
app.use(bodyParser.json());

// ✅ ประกาศครั้งเดียวพอ
const PORT = process.env.PORT || 10000;

app.post('/line-webhook', async (req, res) => {
  const events = req.body.events || [];
  for (const event of events) {
    try {
      if (event.type === 'message' && event.message.type === 'text') {
        await handleTextMessage(event);
        continue;
      }
      if (event.type === 'postback') {
        await handlePostback(event);
        continue;
      }
    } catch (err) {
      console.error('Event Error:', err);
    }
  }
  res.sendStatus(200);
});

app.get('/ping', (req, res) => res.send('pong'));

// ✅ สำคัญสำหรับ Render: bind 0.0.0.0 และใช้พอร์ตจาก ENV
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
