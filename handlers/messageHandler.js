// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const { getState, setState } = require('../services/stateStore');
const { retrieve } = require('../services/ragStore');
const { askAI } = require('../services/aiService.gemini');
const { getQuickReplyByMode } = require('../quickreply/presets');

// ===== helper: fallback summary from RAG =====
function summarizeFromRag(hits) {
  // เอา title + content สั้น ๆ มาประกอบ
  return hits
    .map(h => `• ${h.title || ''}\n${h.content}`)
    .join('\n\n');
}

async function handleTextMessage(event) {
  const replyToken = event.replyToken;
  const userText = (event.message.text || '').trim().toLowerCase();

  const hits = await retrieve(userText);

  // ✅ ถ้า RAG มีข้อมูล → ต้องตอบแน่นอน
  if (hits.length > 0) {
    let finalAnswer;

    try {
      // ✅ พยายามให้ Gemini เรียบเรียง
      const { answer } = await askAI(userText, hits);
      finalAnswer = answer;
    } catch (err) {
      // ✅ Gemini ล่ม → fallback ด้วย RAG ตรง ๆ
      console.warn('Gemini error, fallback to RAG:', err.message);

      finalAnswer =
        'จากคู่มือระบบ พบข้อมูลที่เกี่ยวข้องดังนี้นะครับ\n\n' +
        summarizeFromRag(hits);
    }

    return reply(replyToken, {
      type: 'text',
      text:
        `เดี๋ยวผมสรุปข้อมูลให้แบบเข้าใจง่ายนะครับ\n\n${finalAnswer}`,
      quickReply: getQuickReplyByMode('ai')
    });
  }

  // ❌ ไม่มี RAG จริง ๆ ค่อย fallback
  return reply(replyToken, {
    type: 'text',
    text:
      'ขออภัยครับ ตอนนี้ยังไม่มีข้อมูลในหัวข้อนี้ในระบบ ' +
      'หากต้องการให้เจ้าหน้าที่ช่วยตรวจสอบ สามารถพิมพ์ “ติดต่อเจ้าหน้าที่” ได้เลยครับ',
    quickReply: getQuickReplyByMode('ai')
  });
}

module.exports = { handleTextMessage };
