// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const { getState, setState } = require('../services/stateStore');
const { helpModePreset, backToAIPreset } = require('../quickreply/presets');
const { mainMenu } = require('../flexMessages');
const categoryMenus = require('../manual');
const matchCategory = require('../utils/matchCategory');
const { askAI } = require('../services/aiService.gemini');

// คำทัก/คำทั่วไปที่ให้ขึ้น Quick Reply เลือกโหมด
const blacklist = [
  'โอเค', 'โอเคครับ', 'ค่ะ', 'ครับ', 'จ้า',
  'ฮัลโหล', 'สวัสดีครับ', 'สวัสดีคับ', 'สวัสดีค่ะ'
];

// ฟังก์ชันช่วยประเมินความซับซ้อนแบบง่าย
function isComplex(text) {
  const kw = ['ด่วน', 'ร้องเรียน', 'เชื่อมระบบ', 'อินวอยซ์', 'สัญญา', 'กฎหมาย', 'api', 'error', 'ผิดพลาด'];
  if (text.length > 180) return true;
  return kw.some(k => text.toLowerCase().includes(k));
}

async function handleTextMessage(event) {
  const replyToken = event.replyToken;
  const userId = event.source.userId;
  const userText = (event.message.text || '').trim();
  const lowerText = userText.toLowerCase();

  const state = getState(userId);

  // 0) คำสั่งลัด: ให้ผู้ใช้พิมพ์เพื่อ "กลับไป AI" ได้ทุกเมื่อ
  //    ใช้ได้แม้อยู่ในโหมด human และกรณี Quick Reply ไม่ขึ้น
  if (['กลับไป ai', 'ถาม ai', 'โหมด ai'].includes(lowerText)) {
    setState(userId, { mode: 'ai' });
    return reply(replyToken, {
      type: 'text',
      text: 'กลับเข้าสู่โหมด AI แล้วครับ พิมพ์คำถามได้เลย'
    });
  }

  // 1) ทักทายทั่วไป → เสนอ Quick Reply โหมดช่วยเหลือ
  if (blacklist.includes(userText)) {
    return reply(replyToken, helpModePreset('ถ้าต้องการความช่วยเหลือ เลือกโหมดด้านล่างได้เลยครับ'));
  }

  // 2) คำว่า "คู่มือ"
  if (userText === 'คู่มือ' || userText === 'คู่มือการใช้งาน') {
    return reply(replyToken, mainMenu);
  }

  // 3) จับหมวดตรงตัว
  if (categoryMenus[userText]) {
    return reply(replyToken, categoryMenus[userText]);
  }

  // 4) จับใกล้เคียงด้วย matchCategory()
  const matched = matchCategory(userText);
  if (matched && categoryMenus[matched]) {
    return reply(replyToken, categoryMenus[matched]);
  }

  // 5) อยู่โหมด AI → เรียกโมดูล AI (รองรับ RAG ถ้าคุณส่ง hits เข้า askAI ภายนอก)
  if (state.mode === 'ai') {
    const { answer, failed } = await askAI(userText);

    if (failed) {
      // AI ไม่มั่นใจ/ไม่มีข้อมูล → เสนอคุยกับเจ้าหน้าที่
      return reply(
        replyToken,
        helpModePreset('คำถามนี้อาจซับซ้อน ต้องการให้เจ้าหน้าที่ช่วยไหมครับ')
      );
    }

    return reply(replyToken, { type: 'text', text: answer });
  }

  // 6) อยู่โหมด human → ตีความเป็นข้อความถึงเจ้าหน้าที่ + โชว์ปุ่ม "กลับไปถาม AI"
  if (state.mode === 'human') {
    // ตรงนี้คุณอาจเรียก notifyAgent(event, { lastUserText: userText }) เพื่อส่งต่อให้ทีมงานด้วย
    return reply(
      replyToken,
      backToAIPreset('ผมบันทึกข้อความให้เจ้าหน้าที่แล้ว หากต้องการกลับไปถาม AI กดปุ่มด้านล่างได้ครับ')
    );
  }

  // 7) ยังไม่เลือกโหมด → แนะนำโหมดตามความซับซ้อนของข้อความ
  const suggest = isComplex(userText)
    ? 'คำถามนี้ค่อนข้างซับซ้อน แนะนำให้กด "ติดต่อเจ้าหน้าที่" ครับ'
    : 'แนะนำ "ถามตอบด้วย AI" สำหรับเรื่องทั่วไป หรือกด "ติดต่อเจ้าหน้าที่" ได้ครับ';

  return reply(replyToken, helpModePreset(suggest));
}

module.exports = { handleTextMessage };
