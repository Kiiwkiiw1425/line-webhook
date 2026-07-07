// handlers/postbackHandler.js
const { reply } = require('../services/lineClient');
const { getState, setState, shouldNotify, clearConversation, touch } = require('../services/stateStore');
const { notifyAgent } = require('../services/notifyAgent');
const { parsePostbackData } = require('../quickreply/router');
const { backToAIPreset, helpModePreset } = require('../quickreply/presets');

async function handlePostback(event) {
  const replyToken = event.replyToken;
  const userId = event.source.userId || event.source.groupId || event.source.roomId || 'unknown';
  const data = event.postback?.data || '';
  const params = parsePostbackData(data);

  // อัปเดต lastActivity เสมอ
  touch(userId);

  // --- โหมด AI ---
  if (params.mode === 'ai') {
    setState(userId, { mode: 'ai' });
    return reply(replyToken, { type: 'text', text: 'เข้าสู่โหมด AI แล้วครับ พิมพ์คำถามได้เลย' });
  }

  // --- โหมด Human (ไม่มี ticketRef, แจ้งทีมงานแบบคุมถี่)
  if (params.mode === 'human') {
    const state = getState(userId);
    setState(userId, { mode: 'human' });

    if (shouldNotify(state)) {
      await notifyAgent(event, { lastUserText: '[เลือกจาก Quick Reply]' });
      setState(userId, { notifiedAt: Date.now() });
      return reply(replyToken, [
        { type: 'text', text: 'รับเรื่องติดต่อเจ้าหน้าที่เรียบร้อยครับ' }, // ❌ ไม่มี (อ้างอิง: ref)
        backToAIPreset('หากต้องการกลับไปถาม AI กดปุ่มด้านล่างได้ครับ')
      ]);
    }

    // เคยแจ้งไปไม่นาน → ไม่แจ้งซ้ำ
    return reply(replyToken, [
      { type: 'text', text: 'เข้าสู่โหมดเจ้าหน้าที่แล้วครับ พิมพ์รายละเอียดเพิ่มเติมได้เลย' },
      backToAIPreset('หากต้องการกลับไปถาม AI กดปุ่มด้านล่างได้ครับ')
    ]);
  }

  // --- ปุ่มคุยต่อ/จบคุย (จาก continueOrEndPreset) ---
  if (params.conv === 'continue') {
    const s = getState(userId);
    if (s.mode === 'human') {
      return reply(replyToken, backToAIPreset('พร้อมดำเนินการต่อครับ ต้องการถาม AI กดปุ่มด้านล่างได้เลย'));
    }
    return reply(replyToken, helpModePreset('ต้องการคุยต่อด้วยโหมดใดครับ'));
  }

  if (params.conv === 'end') {
    clearConversation(userId);
    return reply(replyToken, {
      type: 'text',
      text: 'ขอบคุณครับ ระบบได้ปิดการสนทนาแล้ว หากมีข้อสงสัยเพิ่มเติม พิมพ์มาคุยใหม่ได้ทุกเมื่อครับ'
    });
  }

  // fallback
  return reply(replyToken, helpModePreset('รับทราบครับ เลือกโหมดช่วยเหลือด้านล่างได้เลย'));
}

module.exports = { handlePostback };
