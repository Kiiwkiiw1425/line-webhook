// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const { retrieve } = require('../services/ragStore');
const { askAI } = require('../services/aiService.gemini');
const { getQuickReplyByMode } = require('../quickreply/presets');

/**
 * สรุปจาก RAG ตรง ๆ (ใช้เป็น fallback)
 */
function summarizeFromRag(hits) {
  return hits
    .map(h => `• ${h.title || ''}\n${h.content}`)
    .join('\n\n');
}

async function handleTextMessage(event) {
  const replyToken = event.replyToken;
  const userText = (event.message.text || '').trim();

  // ✅ ดึงข้อมูลจาก RAG ก่อนเสมอ
  const hits = await retrieve(userText);

  // ✅ ถ้า RAG มีข้อมูล → ห้ามเงียบ ห้ามบอกว่า "ไม่มีข้อมูล"
  if (hits.length > 0) {
    let finalAnswer;

    try {
      // ✅ พยายามให้ Gemini เรียบเรียง
      const { answer } = await askAI(userText, hits);
      finalAnswer = answer;
    } catch (err) {
      // ✅ Gemini ล่ม (503 ฯลฯ) → fallback ด้วย RAG
      console.warn('Gemini API error, fallback to RAG:', err.message);

      finalAnswer =
        'จากคู่มือของระบบ พบข้อมูลที่เกี่ยวข้องดังนี้นะครับ\n\n' +
        summarizeFromRag(hits);
    }

    return reply(replyToken, {
      type: 'text',
      text:
        `เดี๋ยวผมสรุปข้อมูลให้แบบเข้าใจง่ายนะครับ\n\n${finalAnswer}`,
      quickReply: getQuickReplyByMode('ai')
    });
  }

  // ❌ ไม่มีข้อมูลใน RAG จริง ๆ เท่านั้น ถึงค่อย fallback
  return reply(replyToken, {
    type: 'text',
    text:
      'ขออภัยครับ ตอนนี้ยังไม่มีข้อมูลในหัวข้อนี้ในระบบ ' +
      'หากต้องการให้เจ้าหน้าที่ช่วยตรวจสอบ สามารถพิมพ์ “ติดต่อเจ้าหน้าที่” ได้เลยนะครับ',
    quickReply: getQuickReplyByMode('ai')
  });
}

module.exports = { handleTextMessage };
