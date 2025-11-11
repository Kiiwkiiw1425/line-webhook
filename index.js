// index.js (โค้ดที่ได้รับการปรับปรุง)

// ต้องมั่นใจว่าไฟล์ทั้งหมดนี้อยู่ถูก Path และติดตั้ง dependencies ครบ
const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');
const { URLSearchParams } = require('url'); 
const flexMessages = require('./flexMessages');
const { fuseConfig } = require('./fuseConfig'); 

// --- 1. Configuration (ปรับเปลี่ยนตาม Line API ของคุณ) ---
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || 'YOUR_CHANNEL_ACCESS_TOKEN',
  channelSecret: process.env.LINE_CHANNEL_SECRET || 'YOUR_CHANNEL_SECRET',
};

const client = new Client(config);
const app = express();
const PORT = process.env.PORT || 10000;

// คำที่ต้องการดักจับเพื่อแสดง userRoleSelector
const GUIDE_KEYWORDS = ['คู่มือ', 'วิธีใช้', 'คู่มือการใช้งาน', 'เริ่มต้นใช้งาน'];

// ------------------------------------------------
// 2. Handler Logic
// ------------------------------------------------

function handleUserMessage(userMessage) {
    if (typeof userMessage !== 'string') return null;

    const normalizedMessage = userMessage.toLowerCase().trim();
    let replyMessage = null;

    // A. Logic ดักจับคำหลัก 'คู่มือ' (ส่ง userRoleSelector)
    if (GUIDE_KEYWORDS.some(keyword => normalizedMessage.includes(keyword)) && !normalizedMessage.startsWith('action=')) {
        replyMessage = flexMessages.userRoleSelector;
    }

    // B. Logic จัดการ Postback Data (Postback Handler)
    if (normalizedMessage.startsWith('action=')) {
        // เพิ่ม Try-Catch ภายใน Logic ส่วนนี้เพื่อดักจับ Error ในการประมวลผล Postback
        try {
            const urlParams = new URLSearchParams(userMessage);
            const action = urlParams.get('action');
            const level = urlParams.get('level');
            const category = urlParams.get('category');
            const topic = urlParams.get('topic');
            
            if (action === 'show_level') {
                if (level === 'beginner') {
                    replyMessage = flexMessages.beginnerMenu;
                } else if (level === 'advance') {
                    replyMessage = flexMessages.mainMenu;
                }
            }
            
            if (action === 'show_menu' && category) {
                // ต้องมีเมนูย่อยของ Advance ที่นี่ ถ้าไม่มีจะส่ง Text ตอบกลับ
                replyMessage = { type: 'text', text: `กำลังแสดงเมนูสำหรับหมวดหมู่: ${category} (Advance) โปรดเพิ่ม Logic เมนูย่อยในโค้ด` };
            }

            if (action === 'show_content' && topic) {
                // ป้องกันการเข้าถึง undefined content
                if(flexMessages.beginnerContent && flexMessages.beginnerContent[topic]) {
                    replyMessage = flexMessages.beginnerContent[topic];
                }
            }
        } catch (e) {
            console.error("Postback Processing Error:", e);
            // ตอบกลับด้วยข้อความ Error ป้องกันเซิร์ฟเวอร์ล่ม
            replyMessage = { type: 'text', text: 'เกิดข้อผิดพลาดในการประมวลผลเมนู กรุณาลองใหม่' };
        }
    }


    // C. Fallback Logic (ใช้ Fuse.js ค้นหา)
    if (!replyMessage) {
        // เพิ่ม Try-Catch เพื่อป้องกัน Fuse.js ล้มเหลว
        try {
            const matchedCategory = matchCategory(userMessage);
            if (matchedCategory) {
                if (matchedCategory !== 'คำถาม/ช่วยเหลือ') {
                     replyMessage = flexMessages.mainMenu; 
                } else {
                    replyMessage = { type: 'text', text: 'ติดต่อเจ้าหน้าที่ หรือดูคำถามที่พบบ่อยได้ที่นี่ค่ะ' };
                }
            }
        } catch (e) {
             console.error("Fuse Search Error:", e);
             // ไม่ต้องทำอะไร ปล่อยให้ไปใช้ Default response
        }
    }

    // D. Default response
    if (!replyMessage) {
        replyMessage = { type: 'text', text: 'ขออภัยค่ะ ไม่พบคำตอบที่เกี่ยวข้อง ลองพิมพ์ "คู่มือ" เพื่อเริ่มต้นใช้งาน หรือระบุคำค้นหาให้ชัดเจนขึ้น' };
    }

    return replyMessage;
}


// ------------------------------------------------
// 3. Line Bot Event Handler
// ------------------------------------------------

const handleEvent = async (event) => {
    // โค้ดนี้รับประกันว่า Event เป็น message หรือ postback เท่านั้น
    if (event.type !== 'message' && event.type !== 'postback') {
        return null;
    }

    let userMessage = '';
    // การดึงข้อความ/Postback data
    if (event.type === 'message' && event.message.type === 'text') {
        userMessage = event.message.text;
    } else if (event.type === 'postback') {
        userMessage = event.postback.data;
    } else {
        return null;
    }

    const reply = handleUserMessage(userMessage);

    if (reply) {
        return client.replyMessage(event.replyToken, reply);
    }
};

// ------------------------------------------------
// 4. Server Setup
// ------------------------------------------------

app.post('/webhook', middleware(config), (req, res) => {
    // เพิ่มการ Logging ที่ชัดเจนขึ้น
    console.log(`Received ${req.body.events.length} event(s).`);

    Promise.all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            // นี่คือส่วนสำคัญ: Log Error ที่ทำให้เซิร์ฟเวอร์ล่มระหว่างประมวลผล
            console.error("LINE WEBHOOK ERROR (500 Internal Error):", err);
            // ส่งสถานะ 200 กลับไปให้ LINE เพื่อยืนยันว่าได้รับ Event แล้ว (แม้ว่าประมวลผลไม่สำเร็จก็ตาม)
            res.status(200).end(); 
            
            // หมายเหตุ: การส่ง 500 กลับไปทำให้ LINE แจ้งเตือน ถ้าคุณต้องการซ่อน Error จาก LINE ให้ใช้ res.status(200).end();
            // แต่เนื่องจากคุณได้รับ 500 จาก LINE อยู่แล้ว แสดงว่าโค้ดล้มก่อนเข้าถึง Catch Block นี้
            // โค้ดที่ล้มเหลวส่วนใหญ่อยู่ในการ require() หรือใน Promise.all
        });
});

app.get('/', (req, res) => {
    res.send('Line Webhook is running!');
});

app.listen(PORT, () => {
    console.log(`Server running and listening on port ${PORT}`);
});
