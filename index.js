// index.js

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const { mainMenu } = require('./flexMessages');
const categoryMenus = require('./manual');          // โหลดทุกหมวดจาก manual/
const matchCategory = require('./utils/matchCategory'); // ฟังก์ชันจับคำใกล้เคียง

// ✅ คำพูดเชิงสนทนา (social words)
const blacklist = [
  'โอเค',
  'โอเคครับ',
  'ค่ะ',
  'ครับ',
  'จ้า',
  'ฮัลโหล',
  'สวัสดีครับ',
  'สวัสดีคับ',
  'สวัสดีค่ะ',
  'ขอบคุณ',
  'ขอบคุณครับ',
  'เข้าใจแล้ว',
  'ได้ครับ',
  'ได้ค่ะ'
];

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

if (!CHANNEL_ACCESS_TOKEN) {
  console.error('❌ Environment variable CHANNEL_ACCESS_TOKEN is not set!');
  process.exit(1);
}

// =====================================================
// helper: reply to LINE
// =====================================================
async function replyToLine(replyToken, message) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
  };

  const body = {
    replyToken,
    messages: Array.isArray(message) ? message : [message]
  };

  try {
    await axios.post(url, body, { headers });
  } catch (error) {
    console.error('LINE Reply Error:', error.response?.data || error.message);
  }
}

// =====================================================
// LINE Webhook
// =====================================================
app.post('/line-webhook', async (req, res) => {
  const events = req.body.events || [];

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userText = event.message.text.trim();
      const replyToken = event.replyToken;

      // ✅ 1) SOCIAL WORD GUARD (สำคัญที่สุด)
      if (blacklist.includes(userText)) {
        await replyToLine(replyToken, {
          type: 'text',
          text: 'ยินดีครับ 😊 หากมีคำถามเพิ่มเติมสามารถสอบถามได้เลยนะครับ'
        });
        continue; // ⛔ หยุด ไม่ให้ไหลไป matchCategory
      }

      let message = null;

      // ✅ 2) เมนูหลัก
      if (userText === 'คู่มือ' || userText === 'คู่มือการใช้งาน') {
        message = mainMenu;

      // ✅ 3) ชื่อหมวดตรงตัว
      } else if (categoryMenus[userText]) {
        message = categoryMenus[userText];

      // ✅ 4) fuzzy match (เฉพาะคำถามจริง)
      } else {
        const matched = matchCategory(userText);
        if (matched && categoryMenus[matched]) {
          message = categoryMenus[matched];
        }
      }

      // ✅ 5) ส่งข้อความกลับ (ถ้ามี)
      if (message) {
        await replyToLine(replyToken, message);
      }
    }
  }

  res.sendStatus(200);
});

// =====================================================
// health check
// =====================================================
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
