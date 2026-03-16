// handlers/messageHandler.js
const { reply } = require('../services/lineClient');
const { getState } = require('../services/stateStore');
const { helpModePreset } = require('../quickreply/presets');
const { mainMenu } = require('../flexMessages');
const categoryMenus = require('../manual');
const matchCategory = require('../utils/matchCategory');
const { askAI } = require('../services/aiService.gemini');

const blacklist = ['โอเค', 'โอเคครับ', 'ค่ะ', 'ครับ', 'จ้า', 'ฮัลโหล', 'สวัสดีครับ', 'สวัสดีคับ', 'สวัสดีค่ะ'];

// กรองความซับซ้อนอย่างง่าย
function isComplex(text) {
  const kw = ['ด่วน', 'ร้องเรียน', 'เชื่อมระบบ', 'อินวอยซ์', 'สัญญา', 'กฎหมาย', 'api', 'error', 'ผิดพลาด'];
  if (text.length > 180) return true;
  return kw.some(k => text.toLowerCase().includes(k));
}

async function handleTextMessage(event) {
  const replyToken = event.replyToken;
  const userId = event.source.userId;
  const userText = (event.message.text || '').trim();

  const state = getState(userId);

  // 1) ทักทายทั่วไป → เสนอ Quick Reply พรีเซ็ต
  if (blacklist.includes(userText)) {
    return reply(replyToken, helpModePreset('ถ้าต้องการความช่วยเหลือ เลือกโหมดด้านล่างได้เลยครับ'));
  }

  // 2) คำว่า "คู่มือ"
  if (userText === 'คู่มือ' || userText === 'คู่มือการใช้งาน') {
    return reply(replyToken, mainMenu);
  }

  // 3) ตรงหมวด
  if (categoryMenus[userText]) {
    return reply(replyToken, categoryMenus[userText]);
  }

  // 4) ใกล้เคียง
  const matched = matchCategory(userText);
  if (matched && categoryMenus[matched]) {
    return reply(replyToken, categoryMenus[matched]);
  }

  // 5) โหมด AI (ถ้ามีการเชื่อม AI จริงให้เรียก services/aiService.gemini.js หรือ openai.js)

  if (state.mode === 'ai') {
    const { answer, failed } = await askAI(userText);
  
    if (failed) {
      return reply(
        replyToken,
        helpModePreset('คำถามนี้อาจซับซ้อน ต้องการให้เจ้าหน้าที่ช่วยไหมครับ')
      );
    }
  
    return reply(replyToken, {
      type: 'text',
      text: answer
    });
  }


  // 6) โหมด human: เก็บข้อความเพิ่มเติมแล้วแจ้งเจ้าหน้าที่ได้ (ย้ายไป notifyHandler ถ้าต้องการ)
  if (state.mode === 'human') {
    // ที่จุดนี้คุณอาจเรียก notifyAgent อีกครั้งพร้อม userText
    return reply(replyToken, { type: 'text', text: 'ผมบันทึกข้อความเพิ่มเติมให้เจ้าหน้าที่แล้วครับ' });
  }

  // 7) ยังไม่เลือกโหมด → เสนอ Quick Reply ตามความซับซ้อน
  const text = isComplex(userText)
    ? 'คำถามนี้ค่อนข้างซับซ้อน แนะนำให้กด "ติดต่อเจ้าหน้าที่" ครับ'
    : 'แนะนำ "ถามตอบด้วย AI" สำหรับเรื่องทั่วไป หรือกด "ติดต่อเจ้าหน้าที่" ได้ครับ';

  return reply(replyToken, helpModePreset(text));
}

module.exports = { handleTextMessage };
