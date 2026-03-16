
// index.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const crypto = require('crypto'); // ⬅️ NEW (ถ้าจะทำ signature verify ในอนาคต)
const { mainMenu } = require('./flexMessages');
const categoryMenus = require('./manual'); // โหลดทุกหมวดจาก manual/
const matchCategory = require('./utils/matchCategory'); // ฟังก์ชันจับคำใกล้เคียง

const blacklist = ['โอเค', 'โอเคครับ', 'ค่ะ', 'ครับ', 'จ้า', 'ฮัลโหล', 'สวัสดีครับ', 'สวัสดีคับ', 'สวัสดีค่ะ'];

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
// (ถ้าจะ verify signature ให้ตั้งค่า CHANNEL_SECRET ด้วย)
const CHANNEL_SECRET = process.env.CHANNEL_SECRET || null;

if (!CHANNEL_ACCESS_TOKEN) {
  console.error('❌ Environment variable CHANNEL_ACCESS_TOKEN is not set!');
  process.exit(1);
}

// ===== In-memory user state (ตัวอย่างง่ายๆ; แนะนำย้ายไป Redis/DB ใน production) =====
const userState = new Map(); // key=userId, value={ mode: 'ai' | 'human' | null, updatedAt: Date }

// ฟังก์ชันส่งข้อความกลับไปยัง LINE (reply)
async function replyToLine(replyToken, messages) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
  };
  const body = {
    replyToken,
    messages: Array.isArray(messages) ? messages : [messages]
  };
  try {
    await axios.post(url, body, { headers });
  } catch (error) {
    console.error('LINE Reply Error:', error.response?.data || error.message);
  }
}

// ฟังก์ชัน push ข้อความไปยัง userId/roomId (ใช้ตอนแจ้งเลข ticket ฯลฯ)
async function pushToLine(to, messages) {
  const url = 'https://api.line.me/v2/bot/message/push';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
  };
  const body = {
    to,
    messages: Array.isArray(messages) ? messages : [messages]
  };
  try {
    await axios.post(url, body, { headers });
  } catch (error) {
    console.error('LINE Push Error:', error.response?.data || error.message);
  }
}

// ===== Quick Reply สองปุ่ม: AI & HUMAN =====
function buildModeQuickReply(text = 'เลือกวิธีการช่วยเหลือด้านล่างได้เลยครับ') {
  return {
    type: 'text',
    text,
    quickReply: {
      items: [
        {
          type: 'action',
          action: {
            type: 'postback',
            label: 'ถามตอบด้วย AI',
            data: 'mode=ai',
            displayText: 'ถามตอบด้วย AI'
          }
        },
        {
          type: 'action',
          action: {
            type: 'postback',
            label: 'ติดต่อเจ้าหน้าที่',
            data: 'mode=human',
            displayText: 'ติดต่อเจ้าหน้าที่'
          }
        }
      ]
    }
  };
}

// ===== (ทางเลือก) ตรวจข้อความซับซ้อนแบบง่าย =====
function isComplexQuestion(text) {
  const keywords = ['ด่วน', 'ร้องเรียน', 'เชื่อมระบบ', 'อินวอยซ์', 'สัญญา', 'กฎหมาย', 'API', 'integrate', 'error', 'ผิดพลาด'];
  if (text.length > 180) return true;
  return keywords.some(k => text.toLowerCase().includes(k.toLowerCase()));
}

// ===== ตัวอย่างฟังก์ชันแจ้งเจ้าหน้าที่ (ให้คุณต่อยอด) =====
async function notifyAgent(event, context = {}) {
  const userId = event.source.userId || event.source.groupId || event.source.roomId;
  const ts = new Date().toISOString();
  const lastMsg = context.lastUserText || '-';
  const ref = `TCK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`; // ticket id แบบง่าย
  console.log(`[AGENT NOTIFY] ${ts} - ${userId} requested human support | ref=${ref} | last="${lastMsg}"`);

  // TODO:
  // - ยิง webhook ไป Slack/Teams/CRM
  // - push เข้า LINE group เจ้าหน้าที่
  // - ส่งอีเมล ฯลฯ

  return ref;
}

// ===== (ทางเลือก) Verify signature (ถ้าตั้ง CHANNEL_SECRET) =====
function verifyLineSignature(req) {
  if (!CHANNEL_SECRET) return true; // ข้ามถ้าไม่มี secret
  const signature = req.get('X-Line-Signature');
  if (!signature) return false;
  const hmac = crypto.createHmac('sha256', CHANNEL_SECRET);
  hmac.update(Buffer.from(JSON.stringify(req.body)));
  const digest = hmac.digest('base64');
  return digest === signature;
}

// Webhook รับข้อความจาก LINE
app.post('/line-webhook', async (req, res) => {
  try {
    // (ทางเลือก) เปิดใช้ถ้าต้องการตรวจลายเซ็น
    // if (!verifyLineSignature(req)) {
    //   console.warn('Invalid LINE signature');
    //   return res.sendStatus(403);
    // }

    console.log(JSON.stringify(req.body, null, 2));
    const events = req.body.events || [];

    for (const event of events) {
      const replyToken = event.replyToken;

      // ====== 1) รับ postback จาก Quick Reply ======
      if (event.type === 'postback') {
        const data = event.postback.data || '';
        const userId = event.source.userId;
        if (data === 'mode=ai') {
          userState.set(userId, { mode: 'ai', updatedAt: new Date() });
          await replyToLine(replyToken, {
            type: 'text',
            text: 'คุณเลือกโหมด AI ครับ พิมพ์คำถามมาได้เลย (ถ้าเรื่องซับซ้อน ผมจะประสานเจ้าหน้าที่ต่อให้)'
          });
          continue;
        }
        if (data === 'mode=human') {
          userState.set(userId, { mode: 'human', updatedAt: new Date() });
          const ref = await notifyAgent(event, { lastUserText: '-' });
          await replyToLine(replyToken, [
            { type: 'text', text: `รับเรื่องติดต่อเจ้าหน้าที่เรียบร้อยครับ (เลขอ้างอิง: ${ref})` },
            { type: 'text', text: 'ทีมงานจะติดต่อกลับโดยเร็วที่สุด หากเร่งด่วน โทร 0X-XXX-XXXX' }
          ]);
          continue;
        }
        // ถ้าเป็น postback อื่นๆ ก็ข้ามไป
      }

      // ====== 2) ข้อความเข้า (message event) ======
      if (event.type === 'message' && event.message.type === 'text') {
        const userText = (event.message.text || '').trim();
        const userId = event.source.userId;

        // เก็บโหมดปัจจุบัน (ถ้ามี)
        const state = userState.get(userId) || { mode: null };

        // A) จัดการคำทักทั่วไป/blacklist → เสนอ Quick Reply โหมด
        if (blacklist.includes(userText)) {
          await replyToLine(replyToken, buildModeQuickReply('ถ้าต้องการความช่วยเหลือ เลือกโหมดด้านล่างได้เลยครับ'));
          continue;
        }

        // B) ถ้าพิมพ์ "คู่มือ" → แสดง main menu
        if (userText === 'คู่มือ' || userText === 'คู่มือการใช้งาน') {
          await replyToLine(replyToken, mainMenu);
          continue;
        }

        // C) จับหมวดตรงชื่อเลย
        if (categoryMenus[userText]) {
          await replyToLine(replyToken, categoryMenus[userText]);
          continue;
        }

        // D) จับใกล้เคียงด้วย matchCategory()
        const matched = matchCategory(userText);
        if (matched && categoryMenus[matched]) {
          await replyToLine(replyToken, categoryMenus[matched]);
          continue;
        }

        // E) ถ้าไม่มีในคู่มือ
        //    - ถ้า user อยู่โหมด AI ให้ส่งต่อไปยังระบบ AI ของคุณ (placeholder)
        //    - ถ้าไม่อยู่โหมดใด → ถ้าซับซ้อน แนะนำ "ติดต่อเจ้าหน้าที่", ถ้าไม่ซับซ้อน แนะนำ "ถามตอบด้วย AI"
        if (state.mode === 'ai') {
          // TODO: เรียก AI service ของคุณที่นี่ แล้วตอบกลับ
          // ตัวอย่าง placeholder:
          await replyToLine(replyToken, {
            type: 'text',
            text: 'โหมด AI: ผมยังไม่ได้เชื่อมต่อโมดูล AI ภายนอก ถ้าต้องการให้ผมช่วยต่อเชื่อม แจ้งได้เลยครับ'
          });
          continue;
        }

        if (state.mode === 'human') {
          // หากผู้ใช้พิมพ์ต่อในโหมด human อาจเก็บเป็น context ส่งให้เจ้าหน้าที่
          const ref = await notifyAgent(event, { lastUserText });
          await replyToLine(replyToken, {
            type: 'text',
            text: `ผมบันทึกข้อความเพิ่มเติมและแจ้งเจ้าหน้าที่ให้แล้วครับ (อ้างอิง: ${ref})`
          });
          continue;
        }

        // ยังไม่เลือกโหมด → เสนอ Quick Reply ตามความซับซ้อน
        const suggestText = isComplexQuestion(userText)
          ? 'เนื้อหาดูค่อนข้างซับซ้อน แนะนำให้กด "ติดต่อเจ้าหน้าที่" ครับ'
          : 'หากเป็นเรื่องทั่วไป แนะนำ "ถามตอบด้วย AI" หรือกด "ติดต่อเจ้าหน้าที่" ได้ครับ';
        await replyToLine(replyToken, buildModeQuickReply(suggestText));
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook Error:', err);
    res.sendStatus(500);
  }
});

// ping endpoint
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
