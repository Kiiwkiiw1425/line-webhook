const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

// --- LOAD MODULES ---
// flexMessages: โหลดเมนูนำทางหลัก (L1) และเนื้อหาย่อย (L3)
const flexMessages = require('./flexMessages'); 
const { levelSelectorMenu, beginnerMenu, beginnerContent } = flexMessages;

// categoryMenus: โหลดเนื้อหา Flex Message จาก manual/ (L2/L3)
const categoryMenus = require('./manual'); 

// matchCategory: ฟังก์ชันจับคำใกล้เคียง (Fuzzy Search)
// *** Path นี้อ้างอิงจากโครงสร้างไฟล์ปัจจุบัน: utils/fuseConfig.js ***
const matchCategory = require('./utils/fuseConfig.js'); 

// --- CONFIG ---
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;
// ใช้ชื่อตัวแปรตามที่ LINE Messaging API กำหนด (CHANNEL_ACCESS_TOKEN)
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN; 

if (!CHANNEL_ACCESS_TOKEN) {
    console.error('❌ Environment variable CHANNEL_ACCESS_TOKEN is not set!');
    // ใน Production ควร exit(1) แต่ดีบักให้ log ไว้ก่อน
}

// --- GLOBAL VARIABLES ---
const blacklist = ['โอเค', 'โอเคครับ', 'ค่ะ', 'ครับ', 'จ้า', 'ฮัลโหล', 'สวัสดีครับ', 'สวัสดีคับ', 'สวัสดีค่ะ'];
let isManualMode = false; // ตัวแปรเก็บสถานะโหมด Manual (เริ่มต้น: บอทตอบปกติ)

// --- HELPER FUNCTIONS ---

// ฟังก์ชันส่งข้อความกลับไปยัง LINE (ใช้ Axios)
async function replyToLine(replyToken, message) {
    if (!message || !CHANNEL_ACCESS_TOKEN) return;
    
    const url = 'https://api.line.me/v2/bot/message/reply';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
    };

    const body = {
        replyToken,
        messages: Array.isArray(message) ? message : [message]
    };

    try {
        await axios.post(url, body, { headers });
    } catch (error) {
        console.error('❌ LINE Reply Error:', error.response?.data || error.message);
    }
}

// --- WEBHOOK ENDPOINT ---
app.post('/line-webhook', async (req, res) => {
    const events = req.body.events || [];

    for (const event of events) {
        try {
            // -------------------------------------------------------
            // 1. จัดการ Text Message (พิมพ์ข้อความ)
            // -------------------------------------------------------
            if (event.type === 'message' && event.message.type === 'text') {
                const userText = event.message.text.trim();
                const replyToken = event.replyToken;

                // --- A. ตรวจสอบคำสั่ง Admin เพื่อสลับโหมด ---
                if (userText === '#manual') {
                    isManualMode = true;
                    await replyToLine(replyToken, { type: 'text', text: '🔇 เข้าสู่โหมด Manual: บอทจะเงียบเพื่อให้แอดมินตอบเองครับ' });
                    continue; 
                }
                if (userText === '#auto') {
                    isManualMode = false;
                    await replyToLine(replyToken, { type: 'text', text: '🤖 เข้าสู่โหมด Auto: บอทกลับมาทำงานปกติครับ' });
                    continue; 
                }

                // --- B. ถ้าอยู่ในโหมด Manual ให้หยุดทำงาน (ไม่ตอบกลับ) ---
                if (isManualMode) {
                    console.log(`Skipping reply for "${userText}" because Manual Mode is ON.`);
                    continue;
                }

                // --- C. กรองคำใน Blacklist ---
                if (blacklist.includes(userText.toLowerCase())) {
                    console.log(`Ignored blacklist word: ${userText}`);
                    continue;
                }

                let message = null;

                // --- D. Logic การตอบกลับ (ใช้ MatchCategory) ---
                const matched = matchCategory(userText);
                
                if (matched) {
                    if (matched === 'Level Selector') {
                         // หากตรงกับคำทั่วไป (เช่น 'คู่มือ') ให้แสดงเมนูเลือกระดับ
                         message = levelSelectorMenu;
                    } else if (categoryMenus[matched]) {
                         // หากตรงกับหมวดหมู่คู่มือปกติ
                         message = categoryMenus[matched];
                    }
                }

                if (message) {
                    await replyToLine(replyToken, message);
                } else {
                    // Fallback เมื่อค้นหาไม่เจอ
                    await replyToLine(replyToken, { 
                        type: 'text', 
                        text: `ขออภัยครับ ไม่พบข้อมูลคู่มือที่เกี่ยวข้องกับ "${userText}" ลองพิมพ์คำอื่น หรือคลิกเมนูหลักได้เลยครับ/ค่ะ` 
                    });
                }
            }

            // -------------------------------------------------------
            // 2. จัดการ Postback (เมื่อคลิกปุ่มใน Flex Message)
            // -------------------------------------------------------
            else if (event.type === 'postback') {
                const replyToken = event.replyToken;
                const data = event.postback.data;
                
                // ถ้าอยู่ในโหมด Manual ให้ข้ามการตอบสนองต่อ Postback
                if (isManualMode) continue;

                // แปลง data string (เช่น "action=show_level&level=beginner") เป็น Object
                const params = new URLSearchParams(data);
                const action = params.get('action');
                const categoryKey = params.get('category');
                const level = params.get('level');
                const topic = params.get('topic');

                let message = null;

                if (action === 'show_menu' && categoryKey) {
                    // เมนู L2 (หมวดหมู่ย่อย)
                    message = categoryMenus[categoryKey];
                } else if (action === 'show_level' && level) {
                    // เมนู L1 (เลือก Beginner/Advance)
                    message = (level === 'advance') ? mainMenu : beginnerMenu;
                } else if (action === 'show_content' && topic) {
                    // เมนู L3 (เนื้อหาบทเรียนย่อย)
                    message = beginnerContent[topic];
                }

                if (message) {
                    await replyToLine(replyToken, message);
                }
            }

        } catch (err) {
            console.error('Error handling event:', err);
        }
    }

    res.sendStatus(200);
});

// --- PING ENDPOINT ---
app.get('/ping', (req, res) => {
    res.send('pong');
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
