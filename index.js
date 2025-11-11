// index.js

const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');
const { URLSearchParams } = require('url'); // สำหรับจัดการ Postback
const flexMessages = require('./flexMessages');
const { matchCategory } = require('./fuseConfig'); 

// --- 1. Configuration (ปรับเปลี่ยนตาม Line API ของคุณ) ---
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || 'YOUR_CHANNEL_ACCESS_TOKEN',
  channelSecret: process.env.LINE_CHANNEL_SECRET || 'YOUR_CHANNEL_SECRET',
};

const client = new Client(config);
const app = express();
const PORT = process.env.PORT || 3000;

// คำที่ต้องการดักจับเพื่อแสดง userRoleSelector
const GUIDE_KEYWORDS = ['คู่มือ', 'วิธีใช้', 'คู่มือการใช้งาน', 'เริ่มต้นใช้งาน'];

// ------------------------------------------------
// 2. Handler Logic
// ------------------------------------------------

function handleUserMessage(userMessage) {
    // ต้องตรวจสอบว่าเป็น string ก่อน
    if (typeof userMessage !== 'string') return null;

    const normalizedMessage = userMessage.toLowerCase().trim();
    let replyMessage = null;

    // A. Logic ดักจับคำหลัก 'คู่มือ' (ส่ง userRoleSelector)
    if (GUIDE_KEYWORDS.some(keyword => normalizedMessage.includes(keyword)) && !normalizedMessage.startsWith('action=')) {
        replyMessage = flexMessages.userRoleSelector;
    }

    // B. Logic จัดการ Postback Data (Postback Handler)
    if (normalizedMessage.startsWith('action=')) {
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
            // Placeholder: ควรส่ง Flex Message เมนูย่อยของ Advance ที่นี่
            replyMessage = { type: 'text', text: `กำลังแสดงเมนูสำหรับหมวดหมู่: ${category} (Advance)` };
        }

        if (action === 'show_content' && topic) {
            replyMessage = flexMessages.beginnerContent[topic];
        }
    }


    // C. Fallback Logic (ใช้ Fuse.js ค้นหา)
    if (!replyMessage) {
        const matchedCategory = matchCategory(userMessage);
        if (matchedCategory) {
             // ถ้าเป็นการค้นหาคำทั่วไปที่นำไปสู่เมนู Advance
            if (matchedCategory !== 'คำถาม/ช่วยเหลือ') {
                 replyMessage = flexMessages.mainMenu; 
            } else {
                replyMessage = { type: 'text', text: 'ติดต่อเจ้าหน้าที่ หรือดูคำถามที่พบบ่อยได้ที่นี่ค่ะ' };
            }
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
    if (event.type !== 'message' && event.type !== 'postback') {
        return null;
    }

    let userMessage = '';

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
    Promise.all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

app.get('/', (req, res) => {
    res.send('Line Webhook is running!');
});

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});
