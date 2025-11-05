// index.js (ฉบับสมบูรณ์)
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const matchCategory = require('./utils/matchCategory'); 

// 1. Import เมนูทั้งหมด
//    - categoryMenus มาจาก /manual/index.js ที่คุณสร้างไว้
//    - ที่เหลือมาจาก flexMessages.js
// -----------------------------------------------------------
const categoryMenus = require('./manual'); 
const { 
  mainMenu, 
  levelSelectorMenu, 
  beginnerMenu, 
  beginnerContent 
} = require('./flexMessages'); 
// -----------------------------------------------------------

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

if (!CHANNEL_ACCESS_TOKEN) {
    console.error('❌ Environment variable CHANNEL_ACCESS_TOKEN is not set!');
    process.exit(1);
}

/**
 * ฟังก์ชันส่งข้อความกลับไปยัง LINE
 */
async function replyToLine(replyToken, message) {
    const url = 'https://api.line.me/v2/bot/message/reply';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
    };
    const body = {
        replyToken,
        messages: Array.isArray(message) ? message : [message] // รองรับการส่งหลายข้อความ
    };
    try {
        await axios.post(url, body, { headers });
    } catch (error) {
        console.error('LINE Reply Error:', error.response?.data || error.message);
    }
}

/**
 * Webhook หลัก
 */
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

/**
 * ตัวจัดการ Postback (สำหรับปุ่มคลิก)
 */
async function handlePostback(event) {
  const replyToken = event.replyToken;
  const postbackData = event.postback.data; 
  
  const params = new URLSearchParams(postbackData);
  const action = params.get('action');
  const category = params.get('category'); // (สำหรับ Advance)
  const level = params.get('level'); // (สำหรับ L1)
  const topic = params.get('topic'); // (สำหรับ Beginner)

  let message;

  // --- Flow L1 -> L2 (เลือก Beginner/Advance) ---
  if (action === 'show_level') {
    if (level === 'beginner') {
      message = beginnerMenu; // ส่งสารบัญเริ่มต้น
    } else if (level === 'advance') {
      message = mainMenu; // ส่งเมนู Advance 12 ปุ่ม
    }
  } 
  // --- Flow L1-Advance -> L2-Advance ---
  else if (action === 'show_menu' && category) {
    message = categoryMenus[category]; // (Flow เดิมของคุณ)
    if (!message) {
      message = { type: 'text', text: `ขออภัย, ไม่พบเมนูสำหรับ "${category}"` };
    }
  }
  // --- Flow L2-Beginner -> L3-Beginner ---
  else if (action === 'show_content' && topic) {
    message = beginnerContent[topic]; // ดึงเนื้อหาจาก object beginnerContent
    if (!message) {
      message = { type: 'text', text: `ขออภัย, เนื้อหาสำหรับ "${topic}" ยังไม่พร้อม` };
    }
  }

  if (message) {
    await replyToLine(replyToken, message);
  }
}

/**
 * ตัวจัดการ Text (สำหรับพิมพ์)
 */
async function handleTextMessage(event) {
  const userText = event.message.text.trim();
  const replyToken = event.replyToken;

  let message;

  // --- (จุดเริ่มต้น Flow ใหม่) ---
  if (userText === 'คู่มือ' || userText === 'คู่มือการใช้งาน') {
    message = levelSelectorMenu; // ⭐️ ส่งหน้าเลือก Level
  } 
  // --- (Fallback Flow เดิมสำหรับ Advance user) ---
  else {
    const matched = matchCategory(userText); // ใช้ Fuse.js ค้นหา
    if (matched && categoryMenus[matched]) {
      // ถ้าพิมพ์คำว่า "การลา" (ซึ่งเป็น Advance) ก็ส่งเมนู L2 Advance เลย
      message = categoryMenus[matched]; 
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
