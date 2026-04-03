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
  const params = parsePostbackData(data) || {};

  // ✅ update last activity
  touch(userId);

  // =========================
  // ✅ Switch to AI mode
  // =========================
  if (params.mode === 'ai') {
    setState(userId, { mode: 'ai', promptedAfterInactive: false });
    return reply(replyToken, {
      type: 'text',
      text: 'กลับเข้าสู่โหมด AI แล้วครับ พิมพ์คำถามได้เลย'
    });
  }

  // =========================
  // ✅ Switch to Human mode
  // =========================
  if (params.mode === 'human') {
    const prevState = getState(userId);

    setState(userId, { mode: 'human' });

    // แจ้งเจ้าหน้าที่ (กันแจ้งซ้ำ)
    if (shouldNotify(prevState)) {
      await notifyAgent(event, {
        lastUserText: '[ผู้ใช้กดติดต่อเจ้าหน้าที่]'
      });
      setState(userId, { notifiedAt: Date.now() });
    }

    return reply(replyToken, [
      {
        type: 'text',
        text: 'เจ้าหน้าที่กำลังดูแลคุณอยู่ครับ กรุณาพิมพ์รายละเอียด'
      },
      backToAIPreset('หากต้องการกลับไปถาม AI กดปุ่มด้านล่าง')
    ]);
  }

  // =========================
  // ✅ Inactivity: continue
  // =========================
  if (params.conv === 'continue') {
    setState(userId, { promptedAfterInactive: false });
    return reply(
      replyToken,
      helpModePreset('สามารถพิมพ์คุยต่อได้เลยครับ')
    );
  }

  // =========================
  // ✅ Inactivity: end
  // =========================
  if (params.conv === 'end') {
    clearConversation(userId);
    return reply(replyToken, {
      type: 'text',
      text:
        'ขอบคุณครับ ระบบได้ปิดการสนทนาแล้ว หากมีข้อสงสัยเพิ่มเติม สามารถทักมาใหม่ได้ทุกเมื่อครับ'
    });
  }

  // =========================
  // ✅ fallback
  // =========================
  return reply(
    replyToken,
    helpModePreset('กรุณาเลือกการทำงานจากปุ่มด้านล่าง')
  );
}

module.exports = { handlePostback };
