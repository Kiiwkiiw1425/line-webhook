const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { mainMenu } = require('./flexMessages');
const categoryMenus = require('./manual'); // โหลดทุกหมวดจาก manual/
const matchCategory = require('./utils/matchCategory'); // โหลดฟังก์ชันจับคำใกล้เคียง

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN; // ใช้จาก .env หรือ Render

// เก็บเวลาผู้ใช้ตอบล่าสุด (userId => timestamp)
const userLastActive = new Map();

// ฟังก์ชันส่งข้อความตอบกลับ LINE
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

// ฟังก์ชันส่ง Flex Message แบบเล็ก ถาม "คุณได้รับข้อมูลครบถ้วนหรือยัง?"
async function sendCheckInfoFlex(replyToken) {
  const flexMessage = {
    type: 'flex',
    altText: 'คุณได้รับข้อมูลครบถ้วนหรือยัง?',
    contents: {
      type: 'bubble',
      size: 'kilo',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'คุณได้รับข้อมูลครบถ้วนหรือยัง?',
            weight: 'bold',
            size: 'sm',
            margin: 'md',
            align: 'center'
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'horizontal',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            action: { type: 'message', label: 'ได้ครบแล้ว', text: 'ได้ครบแล้ว' }
          },
          {
            type: 'button',
            style: 'secondary',
            action: { type: 'message', label: 'ยังไม่ครบถ้วน', text: 'ยังไม่ครบถ้วน' }
          },
          {
            type: 'button',
            style: 'link',
            action: { type: 'message', label: 'ติดต่อเจ้าหน้าที่', text: 'ติดต่อเจ้าหน้าที่' }
          }
        ]
      }
    }
  };

  await replyToLine(replyToken, flexMessage);
}

app.post('/line-webhook', async (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));
  const events = req.body.events || [];

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userText = event.message.text.trim();
      const replyToken = event.replyToken;
      const userId = event.source.userId;

      // บันทึกเวลาผู้ใช้ตอบล่าสุด
      userLastActive.set(userId, Date.now());

      let message;

      if (userText === 'คู่มือการใช้งาน' || userText === 'คู่มือ') {
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

      // ตั้ง Timeout 1 นาที หลังผู้ใช้ตอบข้อความ เพื่อเช็ค inactivity
      setTimeout(async () => {
        const lastActive = userLastActive.get(userId) || 0;
        if (Date.now() - lastActive >= 40000) {
          try {
            await sendCheckInfoFlex(replyToken);
          } catch (err) {
            console.error('Error sending check info flex:', err);
          }
        }
      }, 60000);
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
