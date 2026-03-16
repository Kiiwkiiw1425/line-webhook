// index.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const crypto = require('crypto');

const { mainMenu } = require('./flexMessages');
const categoryMenus = require('./manual');
const matchCategory = require('./utils/matchCategory');

const app = express();
app.use(bodyParser.json());

/* ===================== CONFIG ===================== */
const PORT = process.env.PORT || 10000;
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
const CHANNEL_SECRET = process.env.CHANNEL_SECRET || null;

if (!CHANNEL_ACCESS_TOKEN) {
  console.error('❌ CHANNEL_ACCESS_TOKEN is missing');
  process.exit(1);
}

/* ===================== CONSTANT ===================== */
const blacklist = [
  'โอเค', 'โอเคครับ', 'ค่ะ', 'ครับ', 'จ้า',
  'ฮัลโหล', 'สวัสดีครับ', 'สวัสดีคับ', 'สวัสดีค่ะ'
];

/* ===================== STATE ===================== */
// NOTE: production แนะนำ Redis / DB
const userState = new Map(); 
// { userId: { mode: 'ai' | 'human' | null, updatedAt: Date } }

function getUserState(userId) {
  const state = userState.get(userId);
  if (!state) return { mode: null };

  const expired = Date.now() - state.updatedAt.getTime() > 30 * 60 * 1000;
  if (expired) {
    userState.delete(userId);
    return { mode: null };
  }
  return state;
}

/* ===================== LINE HELPERS ===================== */
async function replyToLine(replyToken, messages) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  try {
    await axios.post(
      url,
      {
        replyToken,
        messages: Array.isArray(messages) ? messages : [messages]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
        }
      }
    );
  } catch (err) {
    console.error('LINE Reply Error:', err.response?.data || err.message);
  }
}

/* ===================== QUICK REPLY ===================== */
function buildModeQuickReply(text) {
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

/* ===================== UTILS ===================== */
function isComplexQuestion(text) {
  const keywords = [
    'ด่วน', 'ร้องเรียน', 'เชื่อมระบบ',
    'อินวอยซ์', 'สัญญา', 'กฎหมาย',
    'api', 'error', 'ผิดพลาด'
  ];
  if (text.length > 180) return true;
  return keywords.some(k => text.toLowerCase().includes(k));
}

/* ===================== AGENT NOTIFY ===================== */
async function notifyAgent(event, context = {}) {
  const userId =
    event.source.userId ||
    event.source.groupId ||
    event.source.roomId;

  const ref = `TCK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  console.log('[AGENT]',
    new Date().toISOString(),
    'user=', userId,
    'ref=', ref,
    'msg=', context.lastUserText || '-'
  );

  // TODO:
  // - ส่งเข้า LINE Group / Slack / CRM
  // - บันทึก DB

  return ref;
}

/* ===================== WEBHOOK ===================== */
app.post('/line-webhook', async (req, res) => {
  const events = req.body.events || [];

  for (const event of events) {
    try {
      const replyToken = event.replyToken;

      /* ---------- POSTBACK ---------- */
      if (event.type === 'postback') {
        const data = event.postback.data;
        const userId = event.source.userId;

        if (data === 'mode=ai') {
          userState.set(userId, { mode: 'ai', updatedAt: new Date() });
          await replyToLine(replyToken, {
            type: 'text',
            text: 'เข้าสู่โหมด AI แล้วครับ พิมพ์คำถามมาได้เลย'
          });
          continue;
        }

        if (data === 'mode=human') {
          userState.set(userId, { mode: 'human', updatedAt: new Date() });
          const ref = await notifyAgent(event, {
            lastUserText: '[เลือกจาก Quick Reply]'
          });
          await replyToLine(replyToken, [
            { type: 'text', text: `รับเรื่องเรียบร้อย (อ้างอิง ${ref})` },
            { type: 'text', text: 'เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุดครับ' }
          ]);
          continue;
        }
      }

      /* ---------- MESSAGE ---------- */
      if (event.type === 'message' && event.message.type === 'text') {
        const userText = event.message.text.trim();
        const userId = event.source.userId;
        const state = getUserState(userId);

        // blacklist
        if (blacklist.includes(userText)) {
          await replyToLine(
            replyToken,
            buildModeQuickReply('ต้องการให้ผมช่วยแบบไหนครับ')
          );
          continue;
        }

        // manual
        if (userText === 'คู่มือ' || userText === 'คู่มือการใช้งาน') {
          await replyToLine(replyToken, mainMenu);
          continue;
        }

        if (categoryMenus[userText]) {
          await replyToLine(replyToken, categoryMenus[userText]);
          continue;
        }

        const matched = matchCategory(userText);
        if (matched && categoryMenus[matched]) {
          await replyToLine(replyToken, categoryMenus[matched]);
          continue;
        }

        /* ---------- AI MODE ---------- */
        if (state.mode === 'ai') {
          // TODO: เชื่อม AI จริงใน step ถัดไป
          await replyToLine(replyToken, {
            type: 'text',
            text: '⚙️ โหมด AI: ยังไม่ได้เชื่อมระบบ AI จริง'
          });
          continue;
        }

        /* ---------- HUMAN MODE ---------- */
        if (state.mode === 'human') {
          const ref = await notifyAgent(event, {
            lastUserText: userText
          });
          await replyToLine(replyToken, {
            type: 'text',
            text: `ผมส่งข้อมูลเพิ่มเติมให้เจ้าหน้าที่แล้ว (อ้างอิง ${ref})`
          });
          continue;
        }

        /* ---------- FALLBACK ---------- */
        const suggest = isComplexQuestion(userText)
          ? 'คำถามนี้ค่อนข้างซับซ้อน ต้องการติดต่อเจ้าหน้าที่ไหมครับ'
          : 'ผมสามารถช่วยตอบด้วย AI ได้ หรือให้เจ้าหน้าที่ช่วยดูต่อครับ';

        await replyToLine(replyToken, buildModeQuickReply(suggest));
      }
    } catch (err) {
      console.error('Event Error:', err);
      if (event.replyToken) {
        await replyToLine(event.replyToken, {
          type: 'text',
          text: 'ขออภัย ระบบขัดข้องชั่วคราวครับ'
        });
      }
    }
  }

  res.sendStatus(200);
});

/* ===================== HEALTH CHECK ===================== */
app.get('/ping', (req, res) => res.send('pong'));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
