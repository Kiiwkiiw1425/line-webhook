// index.js (ไฟล์หลัก)

const express = require('express');
const line = require('@line/bot-sdk');

// --- 1. นำเข้าเมนูทั้งหมดจากโฟลเดอร์ manual ---
const categoryMenus = require('./manual'); 

// --- 2. ตั้งค่า Config ---
const config = {
  channelAccessToken: process.env.YOUR_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.YOUR_CHANNEL_SECRET
};

const client = new line.Client(config);
const app = express();

// === 1. Endpoint สำหรับ Ping (Uptime Monitor) ===
app.get("/ping", (req, res) => {
  console.log("Ping received!");
  res.status(200).send("OK");
});

// --- 2. Endpoint หลักสำหรับ LINE Webhook (/callback) ---
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error("Webhook Error:", err);
      res.status(500).end();
    });
});

// --- 3. ฟังก์ชันจัดการ Event หลัก ---
async function handleEvent(event) {
  
  // === 3.1: จัดการ Postback (เมื่อคลิกเมนู) ===
  if (event.type === 'postback') {
    const data = event.postback.data; 
    let replyContent;

    // สร้าง Key Map สำหรับ Rich Menu
    const postbackToActionKey = {
      'action=help': 'คำถาม/ช่วยเหลือ',
      'action=update': 'อัปเดตระบบ/การใช้งาน'
      // เพิ่มปุ่มอื่นๆ ตรงนี้...
    };

    const thaiNameKey = postbackToActionKey[data];

    if (thaiNameKey) {
      // ค้นหา Flex Message จาก Object ที่นำเข้า
      replyContent = categoryMenus[thaiNameKey].flexMessage || categoryMenus[thaiNameKey]; // ใช้ .flexMessage ถ้าคุณจัดโครงสร้างตามคำแนะนำ
    }

    if (replyContent) {
      return client.replyMessage(event.replyToken, replyContent);
    } else {
      console.warn(`ไม่พบเนื้อหาสำหรับ Postback data: ${data}`);
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'ขออภัยครับ ไม่พบเมนูที่ร้องขอ'
      });
    }
  }

  // === 3.2: จัดการ Message (ที่ User พิมพ์มา) ===
  if (event.type === 'message' && event.message.type === 'text') {
    const userText = event.message.text;

    // TODO: เพิ่มโค้ด AI/ค้นหา ด้วย Keyword หรือ Gemini API ตรงนี้
    
    // โค้ดสำหรับตอบกลับแบบนกแก้วชั่วคราว (จะถูกลบเมื่อเพิ่ม AI)
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'คุณพิมพ์ว่า: ' + userText
    });
  }

  // หากเป็น Event อื่นๆ ที่เราไม่สนใจ
  return Promise.resolve(null);
}

// สั่งรัน Server
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Bot กำลังรันอยู่ที่ port ${port}`);
});
