// index.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { mainMenu } = require('./flexMessages');
const categoryMenus = require('./manual'); // โหลดทุกหมวดจาก manual/
const matchCategory = require('./utils/matchCategory'); // ฟังก์ชันจับคำใกล้เคียง

const blacklist = ['โอเค', 'โอเคครับ', 'ค่ะ', 'ครับ', 'จ้า', 'ฮัลโหล', 'สวัสดีครับ', 'สวัสดีคับ', 'สวัสดีค่ะ'];

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

if (!CHANNEL_ACCESS_TOKEN) {
    console.error('❌ Environment variable CHANNEL_ACCESS_TOKEN is not set!');
    process.exit(1);
}

// ฟังก์ชันส่งข้อความกลับไปยัง LINE
async function replyToLine(replyToken, message) {
    const url = 'https://api.line.me/v2/bot/message/reply';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
    };

    const body = {
        replyToken,
        messages: [message]
    };

    try {
        await axios.post(url, body, { headers });
    } catch (error) {
        console.error('LINE Reply Error:', error.response?.data || error.message);
    }
}


// Webhook รับข้อความจาก LINE
app.post('/line-webhook', async (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));
  const events = req.body.events || [];

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userText = event.message.text.trim();
      const replyToken = event.replyToken;

      let message;

      if (userText === 'คู่มือ' || userText === 'คู่มือการใช้งาน') {
        message = mainMenu;
      } else if (categoryMenus[userText]) {
        message = categoryMenus[userText];
      } else {
        const matched = matchCategory(userText);
        if (matched && categoryMenus[matched]) {
          message = categoryMenus[matched];
        } else {
          message = null;
        }
      }

      if (message) {
        await replyToLine(replyToken, message);
      }
    }
  }

  res.sendStatus(200);
});

// ping endpoint
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
