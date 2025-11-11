// index.js (ไฟล์หลัก)

const express = require('express');
const line = require('@line/bot-sdk');

// --- 1. นำเข้าเมนูทั้งหมดจากโฟลเดอร์ manual ---
const categoryMenus = require('./manual'); 
// (ไฟล์ manual/index.js ของคุณทำส่วนนี้ถูกต้องแล้ว)

// --- 2. ตั้งค่า Config ---
// (อย่าลืมตั้งค่า YOUR_CHANNEL_ACCESS_TOKEN และ YOUR_CHANNEL_SECRET ใน Environment ของ Server)
const config = {
  channelAccessToken: process.env.YOUR_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.YOUR_CHANNEL_SECRET
};

const client = new line.Client(config);
const app = express();

// --- 3. สร้าง Endpoint /callback ---
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// --- 4. ส่วนสำคัญที่เพิ่มเข้ามา: จัดการ Event ---
async function handleEvent(event) {
  
  // === 4.1: จัดการ Postback (ที่คลิกจาก Rich Menu) ===
  // นี่คือส่วนที่แก้ปัญหา "ปุ่มนิ่ง" ครับ
  if (event.type === 'postback') {
    const data = event.postback.data; // เช่น 'action=help' หรือ 'action=update'
    let replyContent;

    // สร้างตัวแปล Postback data (action=help) ให้เป็น Key ภาษาไทย
    // ที่ตรงกับใน manual/index.js ของคุณ
    const postbackToActionKey = {
      'action=help': 'คำถาม/ช่วยเหลือ',
      'action=update': 'อัปเดตระบบ/การใช้งาน'
      // เพิ่มปุ่มอื่นๆ ตรงนี้...
    };

    // ดึงชื่อ Key ภาษาไทย
    const thaiNameKey = postbackToActionKey[data];

    if (thaiNameKey) {
      // ค้นหาเนื้อหาเมนู (Flex Message) จาก Object ที่คุณเตรียมไว้
      replyContent = categoryMenus[thaiNameKey];
    }

    if (replyContent) {
      // ตอบกลับด้วย Flex Message ที่หาเจอ
      return client.replyMessage(event.replyToken, replyContent);
    } else {
      // กรณีหาไม่เจอ (เช่น เพิ่มปุ่มใน JSON แต่ลืมเพิ่มใน postbackToActionKey)
      console.warn(`ไม่พบเนื้อหาสำหรับ Postback data: ${data}`);
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'ขออภัยครับ ไม่พบเนื้อหาที่ร้องขอ'
      });
    }
  }

  // === 4.2: จัดการ Message (ที่ User พิมพ์มา) ===
  // ส่วนนี้จะใช้สำหรับ "ระบบตอบกลับอัตโนมัติ" ในข้อ 2 ครับ
  if (event.type === 'message' && event.message.type === 'text') {
    const userText = event.message.text;

    // (เดี๋ยวเราจะมาเพิ่มโค้ด AI/ค้นหา ตรงนี้ในข้อ 2)
    
    // โค้ดชั่วคราว: ตอบกลับแบบนกแก้วไปก่อน
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'คุณพิมพ์ว่า: ' + userText
    });
  }

  // หากเป็น Event อื่นๆ ที่เราไม่สนใจ (เช่น join, leave)
  return Promise.resolve(null);
}

// สั่งรัน Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Bot กำลังรันอยู่ที่ port ${port}`);
});
