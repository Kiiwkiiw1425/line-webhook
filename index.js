// index.js
const express = require('express');
const bodyParser = require('body-parser'); // ใช้ได้ หรือเปลี่ยนเป็น express.json() ก็ได้
const axios = require('axios');
const crypto = require('crypto'); // สำหรับตรวจลายเซ็น LINE (แนะนำ)
const { mainMenu } = require('./flexMessages');
const categoryMenus = require('./manual');
const matchCategory = require('./utils/matchCategory');

const app = express();
app.use(bodyParser.json()); // หรือ: app.use(express.json());

const PORT = process.env.PORT || 10000;
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
const CHANNEL_SECRET = process.env.CHANNEL_SECRET;        // <-- เพิ่มเพื่อ verify webhook
const COPILOT_KEY = process.env.COPILOT_KEY;              // <-- สำหรับ Copilot Agent

if (!CHANNEL_ACCESS_TOKEN) {
  console.error('❌ CHANNEL_ACCESS_TOKEN is not set'); process.exit(1);
}

// ===== util: ตรวจลายเซ็นจาก LINE (แนะนำมาก) =====
function verifyLineSignature(req) {
  if (!CHANNEL_SECRET) return true; // ถ้ายังไม่ตั้งค่า ให้ผ่านไปก่อน
  const signature = req.headers['x-line-signature'];
  const body = JSON.stringify(req.body);
  const expected = crypto.createHmac('sha256', CHANNEL_SECRET)
                         .update(body).digest('base64');
  return signature === expected;
}

// ===== util: ตอบกลับ LINE =====
async function replyToLine(replyToken, message) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
  };
  const body = { replyToken, messages: [message] };
  try {
    await axios.post(url, body, { headers });
  } catch (err) {
    console.error('LINE Reply Error:', err.response?.data || err.message);
  }
}

// ===== LINE Webhook =====
app.post('/line-webhook', async (req, res) => {
  if (!verifyLineSignature(req)) return res.sendStatus(403);

  const events = req.body.events || [];
  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userText = event.message.text.trim();
      const replyToken = event.replyToken;

      let message;
      if (userText === 'คู่มือ' || userText === 'คู่มือการใช้งาน') {
        message = mainMenu;
      } else if (categoryMenus[userText]) {
        message = categoryMenus[userText];
      } else {
        const matched = matchCategory(userText);
        message = (matched && categoryMenus[matched]) ? categoryMenus[matched] : null;
      }

      if (message) await replyToLine(replyToken, message);
      // (ถ้าไม่มี message อาจเพิ่ม fallback text ตอบกลับได้)
    }
  }
  res.sendStatus(200);
});

// ===== Middleware: ตรวจ API Key ของ Copilot =====
function verifyCopilotKey(req, res, next) {
  const key = req.headers['x-copilot-key']; // header name ต้องตรงกับที่ตั้งใน Copilot Studio
  if (!COPILOT_KEY) {
    console.warn('⚠️ COPILOT_KEY is not set on server');
    return res.status(500).json({ error: 'Server not configured' });
  }
  if (key !== COPILOT_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ===== Copilot Agent Callback (เหลืออันเดียว) =====
app.post('/copilot', verifyCopilotKey, async (req, res) => {
  try {
    const { query } = req.body || {};
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Invalid payload. Expecting { query: string }' });
    }

    // ---- ที่นี่คือ logic ตอบกลับให้ Agent ----
    let answerText = '';
    if (categoryMenus[query]) {
      // ถ้าเจอหมวดเป๊ะ แนะนำวิธีให้ผู้ใช้ไปดูใน LINE
      answerText = 'พบหมวดที่เกี่ยวข้องแล้ว ให้พิมพ์ "คู่มือ" ใน LINE เพื่อเปิดเมนูหลัก หรือพิมพ์ชื่อหมวดตรง ๆ เพื่อดูรายละเอียด';
    } else {
      const matched = matchCategory(query);
      if (matched && categoryMenus[matched]) {
        answerText = `คำค้นใกล้เคียงกับหมวด: ${matched}\nพิมพ์ "${matched}" ใน LINE เพื่อดูรายละเอียด`;
      } else {
        answerText = 'รับทราบคำถามแล้วครับ/ค่ะ หากต้องการดูเมนูหลักให้พิมพ์ "คู่มือ" ใน LINE หรือระบุหัวข้อให้ชัดเจนขึ้น';
      }
    }

    return res.json({ answer: answerText });
  } catch (err) {
    console.error('[/copilot] error:', err.message);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// ===== health check =====
app.get('/ping', (_req, res) => res.send('pong'));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
