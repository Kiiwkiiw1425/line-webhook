// line_webhook_handler.js (Webhook Handler - ฉบับสมบูรณ์)

const express = require('express');
const line = require('@line/bot-sdk');

// 1. นำเข้าเมนูทั้งหมดจากโฟลเดอร์ manual
const categoryMenus = require('./manual'); 

// 2. นำเข้าฟังก์ชันจับคู่คีย์เวิร์ด
// สมมติว่าไฟล์ matchCategory.js อยู่ในไดเรกทอรี utils/
const matchCategory = require('./utils/matchCategory'); 

// --- 3. ตั้งค่า Config ---
// **สำคัญ: คุณต้องตั้งค่า Environment Variables (YOUR_CHANNEL_ACCESS_TOKEN, YOUR_CHANNEL_SECRET) ในสภาพแวดล้อมจริง**
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
      // ใช้ console.error เพื่อให้เห็นใน Log ได้ชัดเจน
      console.error("🚨 Webhook Error:", err); 
      res.status(500).end();
    });
});

// --- 3. ฟังก์ชันจัดการ Event หลัก ---
async function handleEvent(event) {
  
  let replyContent = null;
  let debugSource = ''; // ใช้สำหรับ Log ว่ามาจาก Postback หรือ Text Match
  
  // === 3.1: จัดการ Postback (เมื่อคลิกเมนู) ===
  if (event.type === 'postback') {
    const data = event.postback.data; 
    debugSource = 'Postback Click';
    
    // **แก้ไข:** Key Map ต้องตรงกับชื่อหมวดหมู่ภาษาไทยที่ใช้ใน categoryMenus
    const postbackToActionKey = {
      // ตัวอย่างการ Mapping: 'action=[รหัสย่อ]' --> '[ชื่อหมวดหมู่ภาษาไทย]'
      'action=help': 'คำถาม/ช่วยเหลือ', // แก้ไขให้ตรงกับชื่อใน index.js และ matchCategory.js
      'action=update': 'การอัปเดตระบบ',  // แก้ไขให้ตรงกับชื่อใน index.js และ matchCategory.js
      'action=evaluate': 'การประเมินผล', 
      'action=report': 'รายงาน',
      // ... เพิ่มปุ่มอื่นๆ ตรงนี้...
    };

    const thaiNameKey = postbackToActionKey[data];

    if (thaiNameKey) {
      // ดึง Flex Message โดยตรงจาก categoryMenus
      replyContent = categoryMenus[thaiNameKey]; 
      // หากโค้ดในไฟล์ย่อยไม่ได้ export เป็น { flexMessage: ... } ให้ใช้ค่าที่ export มาโดยตรง
    } else {
        console.warn(`⚠️ Postback Warning: ไม่พบ Key Mapping สำหรับ data: ${data}`);
    }
  }

  // === 3.2: จัดการ Message (ที่ User พิมพ์มา) ===
  else if (event.type === 'message' && event.message.type === 'text') {
    const userText = event.message.text;
    debugSource = 'Text Input';

    // 1. ใช้ matchCategory เพื่อหาชื่อหมวดหมู่
    const categoryMatch = matchCategory(userText);
    
    if (categoryMatch) {
      // 2. ถ้าพบหมวดหมู่ ให้ดึง Flex Message
      console.log(`🎯 Match Success: ข้อความ "${userText}" ตรงกับหมวดหมู่: ${categoryMatch}`);
      replyContent = categoryMenus[categoryMatch];
    } else {
      console.log(`⚠️ Match Fail: ไม่พบหมวดหมู่ที่ตรงกับข้อความ: "${userText}"`);
      // Fallback สำหรับข้อความที่ไม่ตรงกับหมวดหมู่ใดๆ
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: `ขออภัยค่ะ ไม่พบข้อมูลคู่มือที่ตรงกับ "${userText}" กรุณาลองพิมพ์คำหลักที่กระชับ หรือคลิกที่เมนูด้านล่างค่ะ`
      });
    }
  }

  // === 4. สรุปและส่งข้อความตอบกลับ ===
  if (replyContent) {
    // ตรวจสอบว่าเนื้อหาที่ดึงมามีค่าหรือไม่ (ป้องกันค่า undefined)
    if (replyContent.type === 'flex') {
        console.log(`🎉 Success (${debugSource}): ส่ง Flex Message สำหรับหมวดหมู่: ${replyContent.altText}`);
        return client.replyMessage(event.replyToken, replyContent);
    } else {
        // หากเจอ Category Key แต่เนื้อหาที่โหลดมาไม่ใช่ Flex Message
        console.error(`🚨 Fatal Error (${debugSource}): โหลด Flex Message ไม่สำเร็จสำหรับ Key ที่จับคู่ได้`);
        return client.replyMessage(event.replyToken, {
             type: 'text',
             text: 'ระบบคู่มือเกิดข้อผิดพลาดในการโหลดเนื้อหา โปรดติดต่อผู้ดูแลระบบ'
        });
    }
  }

  // หากเป็น Event อื่นๆ ที่เราไม่สนใจ หรือ Postback ที่ไม่มี content
  return Promise.resolve(null);
}

// สั่งรัน Server
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`🤖 Bot กำลังรันอยู่ที่ port ${port}`);
});
