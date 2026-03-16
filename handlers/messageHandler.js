// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const { getState, setState } = require('../services/stateStore');
const { helpModePreset, backToAIPreset } = require('../quickreply/presets');
const { mainMenu } = require('../flexMessages');
const categoryMenus = require('../manual');
const matchCategory = require('../utils/matchCategory');
const { askAI } = require('../services/aiService.gemini');
const { retrieve } = require('../services/ragStore');

// ข้อความมาตรฐาน
const NO_DATA_REPLY = 'ไม่มีข้อมูล หรือไม่มีคำตอบ กรุณาติดต่อเจ้าหน้าที่';

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

  // 0) คำสั่งลัดสลับโหมด
  // 0.1) กลับไป AI (กันกรณี Quick Reply ไม่ขึ้น)
  if (['กลับไป ai', 'ถาม ai', 'โหมด ai'].includes(lowerText)) {
    setState(userId, { mode: 'ai' });
    return reply(replyToken, { type: 'text', text: 'กลับเข้าสู่โหมด AI แล้วครับ พิมพ์คำถามได้เลย' });
  }
  // 0.2) เข้าสู่โหมดเจ้าหน้าที่ด้วยคำสั่งพิมพ์
  if (['ติดต่อเจ้าหน้าที่', 'human', 'โหมดเจ้าหน้าที่'].includes(lowerText)) {
    setState(userId, { mode: 'human' });
    return reply(replyToken, [
      { type: 'text', text: 'เข้าสู่โหมดเจ้าหน้าที่แล้วครับ พิมพ์รายละเอียดเพิ่มเติมได้เลย' },
      backToAIPreset('หากต้องการกลับไปถาม AI กดปุ่มด้านล่างได้ครับ')
    ]);
  }

  // 1) ทักทายทั่วไป → เสนอ Quick Reply โหมดช่วยเหลือ
  if (blacklist.includes(userText)) {
    return reply(replyToken, helpModePreset('ถ้าต้องการความช่วยเหลือ เลือกโหมดด้านล่างได้เลยครับ'));
  }

  // 2) คำว่า "คู่มือ"
  //    ✅ ส่ง Flex ได้เฉพาะ human; หากไม่ใช่ human ให้ชวนเลือกโหมดแทน
  if (userText === 'คู่มือ' || userText === 'คู่มือการใช้งาน') {
    if (state.mode === 'human') {
      return reply(replyToken, mainMenu); // ✅ Flex เฉพาะ human
    }
    // ❌ ยังไม่ใช่ human → แจ้งผู้ใช้ + เสนอ Quick Reply
    return reply(
      replyToken,
      helpModePreset('เมนูคู่มือแบบภาพเปิดดูได้เฉพาะโหมดเจ้าหน้าที่ หากต้องการดู กรุณาเลือก "ติดต่อเจ้าหน้าที่"')
    );
  }

  // 3) จับหมวดตรงตัว (เช่น ผู้ใช้พิมพ์ชื่อหมวดใน manual/)
  if (categoryMenus[userText]) {
    if (state.mode === 'human') {
      return reply(replyToken, categoryMenus[userText]); // ✅ Flex เฉพาะ human
    }
    return reply(
      replyToken,
      helpModePreset('เมนูนี้เปิดดูได้ในโหมดเจ้าหน้าที่ กด "ติดต่อเจ้าหน้าที่" เพื่อเปิดเมนูครับ')
    );
  }

  // 4) จับใกล้เคียงด้วย matchCategory()
  const matched = matchCategory(userText);
  if (matched && categoryMenus[matched]) {
    if (state.mode === 'human') {
      return reply(replyToken, categoryMenus[matched]); // ✅ Flex เฉพาะ human
    }
    return reply(
      replyToken,
      helpModePreset('เมนูนี้เปิดดูได้ในโหมดเจ้าหน้าที่ กด "ติดต่อเจ้าหน้าที่" เพื่อเปิดเมนูครับ')
    );
  }

  // 5) โหมด AI → ใช้ RAG ก่อนเสมอ (ไม่เจอ → ไม่เรียก AI)
  if (state.mode === 'ai') {
    const hits = await retrieve(userText);

    // ❌ ไม่พบข้อมูลใน RAG → ไม่เรียก AI
    if (!hits || hits.length === 0) {
      return reply(replyToken, { type: 'text', text: NO_DATA_REPLY });
    }

    // ✅ มี knowledge → ส่งเข้าโมเดล
    const { answer, failed } = await askAI(userText, [], hits);

    if (failed) {
      return reply(replyToken, { type: 'text', text: NO_DATA_REPLY });
    }
    return reply(replyToken, { type: 'text', text: answer });
  }

  // 6) โหมด human → ตีความเป็นข้อความถึงเจ้าหน้าที่ + โชว์ปุ่ม "กลับไปถาม AI"
  if (state.mode === 'human') {
    // TODO: หากต้องการส่งต่อหาทีมงาน: notifyAgent(event, { lastUserText: userText })
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
