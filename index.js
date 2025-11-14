// ------------------------------------------------
// 1. DEPENDENCIES
// ------------------------------------------------
const express = require('express');
const line = require('@line/bot-sdk');

// ------------------------------------------------
// 2. MODULE IMPORTS (Core Logic)
// ------------------------------------------------
// categoryMenus: โหลดเนื้อหาคู่มือย่อย (L2/L3) จาก /manual
const categoryMenus = require('./manual'); 

// flexMessages: โหลดเมนูนำทางหลัก (L1) เช่น หน้าเลือก Level, เมนู Advance
const flexMessages = require('./flexMessages'); 

// matchCategory: โหลดฟังก์ชันค้นหาคีย์เวิร์ด
const matchCategory = require('./utils/matchCategory'); 

// ------------------------------------------------
// 3. CONFIG & INITIALIZATION
// ------------------------------------------------
// *** สำคัญมาก: ต้องตั้งค่า Environment Variables บน Server ที่ Deploy ***
const config = {
  channelAccessToken: process.env.YOUR_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.YOUR_CHANNEL_SECRET
};

// ตรวจสอบว่า .env ถูกโหลดมาหรือไม่
if (!config.channelAccessToken || !config.channelSecret) {
    console.error('FATAL ERROR: Environment variables (YOUR_CHANNEL_ACCESS_TOKEN, YOUR_CHANNEL_SECRET) are missing.');
    // ใน Production, ควรใช้ process.exit(1) แต่เพื่อการดีบัก ให้แสดงค่า config
    console.error('Current Config:', JSON.stringify(config));
    // หากไม่ต้องการให้แอปทำงานต่อ ให้ uncomment บรรทัดล่าง
    // process.exit(1); 
}

const client = new line.Client(config);
const app = express();

// ------------------------------------------------
// 4. WEBHOOK ENDPOINTS
// ------------------------------------------------

// Endpoint สำหรับ Ping (Uptime Monitor)
app.get("/ping", (req, res) => {
  console.log("Ping received!");
  res.status(200).send("OK");
});

// Endpoint หลักสำหรับ LINE Webhook (/callback)
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
  	.then((result) => res.json(result))
  	.catch((err) => {
      console.error("Webhook Error (Outside handleEvent):", err);
      // ตอบ 500 เพื่อให้ Line รู้ว่ามีปัญหา
      res.status(500).end();
    });
});

// ------------------------------------------------
// 5. EVENT HANDLER (Core Logic)
// ------------------------------------------------
async function handleEvent(event) {
    
    // *** เพิ่ม Try...Catch เพื่อป้องกัน 500 Internal Server Error ***
    try {
        
        // === 5.1: จัดการ Postback (เมื่อคลิกเมนู) ===
        if (event.type === 'postback') {
            const data = event.postback.data;
            let replyContent;
            
            // ใช้ URLSearchParams (Node.js 10+) เพื่อแยก query string
            const params = new URLSearchParams(data);
            const action = params.get('action');
            const categoryKey = params.get('category'); // สำหรับ action=show_menu
            const level = params.get('level');         // สำหรับ action=show_level
            const topic = params.get('topic');         // สำหรับ action=show_content

            console.log(`[POSTBACK] Action: ${action}, Key: ${categoryKey || level || topic}`);
            
            if (action === 'show_menu' && categoryKey) {
                // ตัวอย่าง: data: 'action=show_menu&category=การลา'
                replyContent = categoryMenus[categoryKey];
                
            } else if (action === 'show_level' && level) {
                // ตัวอย่าง: data: 'action=show_level&level=beginner'
                const menuKey = level === 'advance' ? 'mainMenu' : 'beginnerMenu';
                replyContent = flexMessages[menuKey];

            } else if (action === 'show_content' && topic) {
                // ตัวอย่าง: data: 'action=show_content&topic=leave'
                replyContent = flexMessages.beginnerContent[topic];
            }

            // ตรวจสอบว่า replyContent ไม่ใช่ undefined
            if (replyContent) {
                return client.replyMessage(event.replyToken, replyContent);
            } else {
                console.warn(`[POSTBACK ERROR] ไม่พบเนื้อหาสำหรับ Action: ${data}`);
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: 'ขออภัยครับ ไม่พบเมนูที่ร้องขอ (Postback Failed)'
                });
            }
        }

        // === 5.2: จัดการ Message (ที่ User พิมพ์มา) ===
        if (event.type === 'message' && event.message.type === 'text') {
            const userText = event.message.text;
            let replyContent;
            
            const categoryMatch = matchCategory(userText); 
            
            if (categoryMatch) {
                console.log(`[TEXT INPUT] Match Success: "${userText}" -> "${categoryMatch}"`);
                
                if (categoryMatch === 'Level Selector') {
                    // หากตรงกับคำทั่วไป (เช่น 'คู่มือ') ให้แสดงเมนูเลือกระดับ
                    replyContent = flexMessages.levelSelectorMenu; 
                } else {
                    // หากตรงกับหมวดหมู่คู่มือปกติ (เช่น 'การลา') 
                    replyContent = categoryMenus[categoryMatch];
                }
            }
            
            // ตรวจสอบว่า replyContent ไม่ใช่ undefined
            if (replyContent) {
                return client.replyMessage(event.replyToken, replyContent);
            } else {
                // Fallback หากไม่พบการจับคู่
                console.warn(`[TEXT INPUT] Match Fail: ไม่พบหมวดหมู่ที่ตรงกับข้อความ: "${userText}"`);
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: `ค้นหา "${userText}" ไม่พบ ลองพิมพ์คำอื่น หรือคลิกเมนูหลักได้เลยครับ/ค่ะ`
                });
            }
        }

        // หากเป็น Event อื่นๆ ที่เราไม่สนใจ (เช่น Follow, Unfollow)
        return Promise.resolve(null);
        
    } catch (e) {
        // === ดักจับ Runtime Error ที่เกิดขึ้นภายใน handleEvent ===
        // นี่คือส่วนที่สำคัญที่สุดในการป้องกัน 500 Error
        console.error(`🚨 RUNTIME ERROR in handleEvent:`, e);
        
        // ส่งข้อความหา User ว่ามีปัญหา (Optional, but good for UX)
        // await client.replyMessage(event.replyToken, {
        //     type: 'text',
        //     text: 'ขออภัยค่ะ เกิดข้อผิดพลาดในระบบ กำลังแจ้งผู้ดูแลค่ะ'
        // });

        // คืนค่า null เพื่อให้ Promise.all ทำงานต่อได้
        return Promise.resolve(null); 
    }
}

// ------------------------------------------------
// 6. SERVER START
// ------------------------------------------------
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Bot กำลังรันอยู่ที่ port ${port}`);
});
