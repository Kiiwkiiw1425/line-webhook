// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const { getState, setState } = require('../services/stateStore');
const { retrieve } = require('../services/ragStore');
const { askAI } = require('../services/aiService.gemini');
const { getQuickReplyByMode } = require('../quickreply/presets');

// ✅ ใช้ไฟล์เดียวที่รวมคู่มือทั้งหมด
const manuals = require('../manual/manualCommand');

/**
 * ตรวจ intent เพื่อตัดสินใจว่าใช้คู่มือชุดไหน
 * (Human-like Intent Detection)
 */
function detectManualCategory(text = '') {
  if (/ลงทะเบียน|login|เข้าใช้งาน|password|otp/.test(text)) return 'usageGeneral';
  if (/คำร้อง|ยื่น/.test(text)) return 'application';
  if (/งบประมาณ|เบิก/.test(text)) return 'budget';
  if (/ประเมิน/.test(text)) return 'evaluation';
  if (/นำเข้า|ส่งออก/.test(text)) return 'importExport';
  if (/ลา/.test(text)) return 'leave';
  if (/สิทธิ/.test(text)) return 'permission';
  if (/บุคลากร|เจ้าหน้าที่/.test(text)) return 'personnel';
  if (/ช่วยเหลือ|help/.test(text)) return 'help';
  return 'other';
}

async function handleTextMessage(event) {
  const replyToken = event.replyToken;
  const userId = event.source.userId;
  const userText = (event.message.text || '').trim();
  const lowerText = userText.toLowerCase();

  const state = getState(userId) || {};
  const mode = state.mode || 'ai';

  /* =================================================
   * 1) คำสั่งพิมพ์เปลี่ยนโหมด
   * ================================================= */
  if (['ai', 'ถาม ai', 'โหมด ai'].includes(lowerText)) {
    setState(userId, {
      mode: 'ai',
      lastUnansweredQuestion: null,
      unansweredCount: 0
    });

    return reply(replyToken, {
      type: 'text',
      text: 'เรียบร้อยครับ ตอนนี้กลับมาอยู่ในโหมด AI แล้ว มีเรื่องไหนให้ผมช่วยต่อได้เลยครับ',
      quickReply: getQuickReplyByMode('ai')
    });
  }

  if (['เจ้าหน้าที่', 'ติดต่อเจ้าหน้าที่', 'human'].includes(lowerText)) {
    setState(userId, {
      mode: 'human',
      lastUnansweredQuestion: null,
      unansweredCount: 0
    });

    return reply(replyToken, {
      type: 'text',
      text: 'ผมกำลังโอนให้เจ้าหน้าที่ช่วยดูแลต่อครับ กรุณาพิมพ์รายละเอียดเพิ่มเติมได้เลย',
      quickReply: getQuickReplyByMode('human')
    });
  }

  /* =================================================
   * 2) โหมดเจ้าหน้าที่ → บอทเงียบ
   * ================================================= */
  if (mode === 'human') {
    return;
  }

  /* =================================================
   * 3) โหมด AI
   * ================================================= */
  const hits = await retrieve(userText);

  /* ---------- CASE A: มีข้อมูลใน RAG ---------- */
  if (hits && hits.length > 0) {
    const { answer } = await askAI(userText, hits);

    const category = detectManualCategory(lowerText);
    const manualMenu = manuals[category] || manuals.other;

    // reset state
    setState(userId, {
      mode: 'ai',
      lastUnansweredQuestion: null,
      unansweredCount: 0
    });

    return reply(replyToken, [
      {
        type: 'text',
        text:
          `เดี๋ยวผมสรุปให้แบบเข้าใจง่ายนะครับ\n\n${answer}\n\n` +
          `📘 หากต้องการอ่านรายละเอียดแบบเต็ม สามารถเปิดคู่มือจริงได้จากเมนูด้านล่างครับ`,
        quickReply: getQuickReplyByMode('ai')
      },
      manualMenu
    ]);
  }

  /* ---------- CASE B: ไม่พบข้อมูล (ครั้งแรก) ---------- */
  if (state.lastUnansweredQuestion !== lowerText) {
    setState(userId, {
      mode: 'ai',
      lastUnansweredQuestion: lowerText,
      unansweredCount: 1
    });

    return reply(replyToken, {
      type: 'text',
      text:
        'คำถามนี้เป็นข้อมูลเฉพาะพอสมควรครับ ตอนนี้ผมยังไม่เจอข้อมูลตรงนี้ในระบบ\n\n' +
        'ถ้าสะดวก รบกวนช่วยอธิบายรายละเอียดเพิ่มเติมอีกนิดได้ไหมครับ ' +
        'หรือหากต้องการให้เจ้าหน้าที่ช่วยตรวจสอบ ผมสามารถประสานให้ได้ครับ',
      quickReply: getQuickReplyByMode('ai')
    });
  }

  /* ---------- CASE C: ถามซ้ำ → ส่งต่อเจ้าหน้าที่ ---------- */
  setState(userId, {
    mode: 'human',
    lastUnansweredQuestion: null,
    unansweredCount: 0
  });

  return reply(replyToken, {
    type: 'text',
    text:
      'ผมลองตรวจสอบข้อมูลเพิ่มเติมให้แล้วครับ แต่เรื่องนี้ต้องให้เจ้าหน้าที่ผู้ดูแลระบบช่วยดูรายละเอียดโดยตรง\n\n' +
      'เดี๋ยวผมโอนให้เจ้าหน้าที่ช่วยรับเรื่องต่อให้นะครับ',
    quickReply: getQuickReplyByMode('human')
  });
}

module.exports = { handleTextMessage };
