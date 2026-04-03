// handlers/postbackHandler.js

const { reply } = require('../services/lineClient');
const {
  getState,
  setState,
  shouldNotify,
  clearConversation,
  touch
} = require('../services/stateStore');
const { notifyAgent } = require('../services/notifyAgent');
const { parsePostbackData } = require('../quickreply/router');
const { backToAIPreset, helpModePreset } = require('../quickreply/presets');

async function handlePostback(event) {
  const replyToken = event.replyToken;
  const userId =
    event.source.userId ||
    event.source.groupId ||
    event.source.roomId ||
    'unknown';

  const data = event.postback?.data || '';
  const params = parsePostbackData(data);

  // ✅ อัปเดต lastActivity ทุกครั้ง
  touch(userId);

  // =========================
  // ✅ สลับโหมด: AI
  // =========================
  if (params.mode === 'ai') {
    setState(userId, { mode: 'ai' });
    return reply(replyToken, {
      type: 'text',
      text: 'เข้าสู่โหมด AI แล้วครับ พิมพ์คำถามได้เลย'
    });
  }

  // =========================
  // ✅ สลับโหมด: Human
  // =========================
  if (params.mode === 'human') {
    const prevState = getState(userId);

    setState(userId, { mode: 'human' });

    // แจ้งเจ้าหน้าที่ (กันแจ้งถี่)
    if (shouldNotify(prevState)) {
      await notifyAgent(event, {
        lastUserText: '[ผู้ใช้เลือกติดต่อเจ้าหน้าที่]'
      });
      setState(userId, { notifiedAt: Date.now() });
    }

    return reply(replyToken, [
      {
        type: 'text',
        text: 'เจ้าหน้าที่กำลังดูแลคุณอยู่ครับ กรุณาพิมพ์รายละเอียด'
      },
      backToAIPreset('หากต้องการกลับไปถาม AI กดปุ่มด้านล่างได้ครับ')
    ]);
  }

  // =========================
  // ✅ ปุ่มคุยต่อ
  // =========================
  if (params.conv === 'continue') {
    const state = getState(userId);
    if (state.mode === 'human') {
      return reply(
        replyToken,
        backToAIPreset('พร้อมดำเนินการต่อครับ ต้องการกลับไปถาม AI กดปุ่มด้านล่าง')
      );
    }
    return reply(
      replyToken,
      helpModePreset('ต้องการคุยต่อด้วยโหมดใดครับ')
    );
  }

  // =========================
  // ✅ ปุ่มจบการสนทนา
  // =========================
  if (params.conv === 'end') {
    clearConversation(userId);
    return reply(replyToken, {
      type: 'text',
      text:
        'ขอบคุณครับ ระบบได้ปิดการสนทนาแล้ว หากมีข้อสงสัยเพิ่มเติม พิมพ์มาคุยใหม่ได้ทุกเมื่อครับ'
    });
  }

  // =========================
  // ✅ fallback
  // =========================
  return reply(
    replyToken,
    helpModePreset('รับทราบครับ เลือกโหมดช่วยเหลือด้านล่างได้เลย')
  );
}

module.exports = { handlePostback };
