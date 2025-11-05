// index.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

// ⬇️⬇️⬇️ ส่วนที่เปลี่ยนแปลง ⬇️⬇️⬇️
// จากเดิมที่เคยดึงทุกอย่างมาจาก './flexMessages'
// เราจะแยกกันดึงครับ
const { mainMenu } = require('./flexMessages'); // 1. ดึงเมนูหลักจากที่นี่
const categoryMenus = require('./manual'); // 2. ดึงเมนูย่อยอัตโนมัติจาก /manual/index.js
// ⬆️⬆️⬆️ จบส่วนเปลี่ยนแปลง ⬆️⬆️⬆️

const matchCategory = require('./utils/matchCategory'); 

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

if (!CHANNEL_ACCESS_TOKEN) {
    console.error('❌ Environment variable CHANNEL_ACCESS_TOKEN is not set!');
    process.exit(1);
}

// ฟังก์ชันส่งข้อความกลับไปยัง LINE (เหมือนเดิม)
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

// Webhook หลัก (รองรับ Postback)
app.post('/line-webhook', async (req, res) => {
  // console.log(JSON.stringify(req.body, null, 2));
  const events = req.body.events || [];

  for (const event of events) {
    try {
      if (event.type === 'message' && event.message.type === 'text') {
        await handleTextMessage(event);
      } else if (event.type === 'postback') {
        await handlePostback(event);
      }
    } catch (error) {
      console.error('Event Handling Error:', error.message);
    }
  }
  res.sendStatus(200);
});

// ตัวจัดการ Postback (Logic ใหม่สำหรับปุ่มคลิก)
async function handlePostback(event) {
  const replyToken = event.replyToken;
  const postbackData = event.postback.data; 
  
  const params = new URLSearchParams(postbackData);
  const action = params.get('action');
  const category = params.get('category');

  let message;

  if (action === 'show_menu' && category) {
    message = categoryMenus[category]; // ดึงเมนู L2 จากไฟล์ /manual ที่โหลดมา
    
    if (!message) {
      console.warn(`Postback Warning: Category "${category}" not found in categoryMenus.`);
      message = { type: 'text', text: `ขออภัย, ไม่พบเมนูสำหรับ "${category}"` };
    }
  }

  if (message) {
    await replyToLine(replyToken, message);
  }
}

// ตัวจัดการ Text (Logic เดิมสำหรับพิมพ์)
async function handleTextMessage(event) {
  const userText = event.message.text.trim();
  const replyToken = event.replyToken;

  let message;

  if (userText === 'คู่มือ' || userText === 'คู่มือการใช้งาน') {
    message = mainMenu; // L1 (12 ปุ่ม)
  } else {
    const matched = matchCategory(userText); // ใช้ Fuse.js ค้นหา
    if (matched && categoryMenus[matched]) {
      message = categoryMenus[matched]; // L2
    } else {
      message = null; // ไม่ต้องตอบ
    }
  }

  if (message) {
    await replyToLine(replyToken, message);
  }
}

// ping endpoint
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
