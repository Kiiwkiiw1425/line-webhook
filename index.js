// ✅ โหลด ENV (ใช้ได้กับ local dev)
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { mainMenu } = require('./flexMessages');
const categoryMenus = require('./manual'); // โหลดเมนูย่อย
const matchCategory = require('./utils/matchCategory'); // ฟังก์ชันจับคำใกล้เคียง

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

// ฟังก์ชันส่งข้อความตอบกลับ LINE
async function replyToLine(replyToken, messages) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
  };

  const body = {
    replyToken,
    messages: Array.isArray(messages) ? messages : [messages]
  };

  try {
    await axios.post(url, body, { headers });
  } catch (error) {
    console.error('LINE Reply Error:', error.response?.data || error.message);
  }
}

// ฟังก์ชันสร้าง Flex Message ถาม "คุณได้รับข้อมูลครบถ้วนหรือยัง?"
function createCheckInfoFlex() {
  return {
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
}

// Webhook สำหรับรับข้อความจาก LINE
app.post('/line-webhook', async (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));
  const events = req.body.events || [];

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userText = event.message.text.trim();
      const replyToken = event.replyToken;

      let message = null;

      if (userText === 'คู่มือการใช้งาน' || userText === 'คู่มือ') {
        message = mainMenu;
      } else if (categoryMenus[userText]) {
        message = categoryMenus[userText];
      } else {
        const matched = matchCategory(userText);
        if (matched && categoryMenus[matched]) {
          message = categoryMenus[matched];
        }
      }

      if (message) {
        // ✅ ส่ง Flex เมนูหลัก + ข้อความสอบถามในรอบเดียว
        await replyToLine(replyToken, [
          message,
          createCheckInfoFlex()
        ]);
      } else {
        await replyToLine(replyToken, {
          type: 'text',
          text: 'ขออภัย ไม่พบหมวดหมู่ที่คุณต้องการ กรุณาลองใหม่อีกครั้ง หรือพิมพ์ "คู่มือ" เพื่อดูเมนูหลักครับ'
        });
      }
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
