// index.js

try { require('dotenv').config(); } catch (e) {
  // ถ้าเซิร์ฟเวอร์ไม่มีแพ็กเกจหรือไม่มี .env ก็ข้ามได้
}


require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const { handleTextMessage } = require('./handlers/messageHandler');
const { handlePostback } = require('./handlers/postbackHandler');

const app = express();
app.use(bodyParser.json());

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
      // type อื่น ๆ
    } catch (err) {
      console.error('Event Error:', err);
      // ไม่ต้อง reply กรณีไม่มี replyToken หรือเกิดข้อผิดพลาดที่ตอบไม่ได้
    }
  }
  res.sendStatus(200);
});

app.get('/ping', (req, res) => res.send('pong'));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
