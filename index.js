// index.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { mainMenu, categoryMenus } = require('./flexMessages'); // การ import
const matchCategory = require('./utils/matchCategory'); // ฟังก์ชันจับคำใกล้เคียง

// Blacklist
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

// ===========================================
// Webhook หลัก
// ===========================================
app.post('/line-webhook', async (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));
  const events = req.body.events || [];

  for (const event of events) {
    try {
      if (event.type === 'message' && event.message.type === 'text') {
        // 1. จัดการกับข้อความที่พิมพ์เข้ามา (Fallback)
        await handleTextMessage(event);
      } else if (event.type === 'postback') {
        // 2. จัดการกับการคลิกปุ่ม (The New UI/UX)
        await handlePostback(event);
      }
    } catch (error) {
      console.error('Event Handling Error:', error.message);
    }
  }
  res.sendStatus(200);
});

// ===========================================
// ตัวจัดการ Postback
// ===========================================
async function handlePostback(event) {
  const replyToken = event.replyToken;
  const postbackData = event.postback.data; // เช่น "action=show_menu&category=การลา"
  
  // ใช้ URLSearchParams เพื่อแยก data
  const params = new URLSearchParams(postbackData);
  const action = params.get('action');
  const category = params.get('category');
  // const subCategory = params.get('sub'); // (เผื่อสำหรับ L3)

  let message;

  if (action === 'show_menu' && category) {
    // นี่คือการคลิกจากเมนูหลัก (L1)
    // 'category' จะเป็น "การลา", "การประเมินผล", etc.
    message = categoryMenus[category]; // ดึงเมนู L2 ที่คุณมีอยู่แล้ว
    
    if (!message) {
      console.warn(`Postback Warning: Category "${category}" not found in categoryMenus.`);
      message = { type: 'text', text: `ขออภัย, ไม่พบเมนูสำหรับ "${category}"` };
    }

  } else if (action === 'show_content') {
    // Logic ที่คุณต้องสร้างเพิ่ม ถ้าเมนู L2 (categoryMenus)
    // ไม่ได้ link ไปยัง PDF โดยตรง แต่ต้องส่ง L3
    // message = findContent(category, subCategory); 
  }

  if (message) {
    await replyToLine(replyToken, message);
  }
}

// ===========================================
// ตัวจัดการ Text (Logic เดิมของคุณที่ปรับปรุง)
// ===========================================
async function handleTextMessage(event) {
  const userText = event.message.text.trim();
  const replyToken = event.replyToken;

  let message;

  // Logic เดิมของคุณ (ใช้เป็น Fallback)
  if (userText === 'คู่มือ' || userText === 'คู่มือการใช้งาน') {
    message = mainMenu; // L1 (12 ปุ่ม)
  } else if (categoryMenus[userText]) {
    // กรณีพิมพ์ตรงตัวเป๊ะ
    message = categoryMenus[userText]; // L2
  } else {
    // กรณีพิมพ์คำใกล้เคียง
    const matched = matchCategory(userText);
    if (matched && categoryMenus[matched]) {
      message = categoryMenus[matched];
    } else {
      // ไม่ต้องตอบข้อความทั่วไป
      message = null; 
    }
  }

  if (message) {
    await replyToLine(replyToken, message);
  }
}


// ping endpoint (เหมือนเดิม)
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
