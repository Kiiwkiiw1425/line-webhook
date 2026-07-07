// handlers/postbackHandler.js

const { reply } = require('../services/lineClient');
const {
  getState,
  setState,
  clearConversation,
  shouldNotify,
  touch
} = require('../services/stateStore');

const { notifyAgent } = require('../services/notifyAgent');
const { parsePostbackData } = require('../quickreply/router');
const { backToAIPreset } = require('../quickreply/presets');

async function handlePostback(event) {

  const replyToken = event.replyToken;

  const userId =
    event.source.userId ||
    event.source.groupId ||
    event.source.roomId;

  const params =
    parsePostbackData(event.postback?.data || '');

  touch(userId);

  /* =====================================
   * Confirm Human
   * ===================================== */

  if (params.action === 'confirm_human') {

    const prev = getState(userId);

    setState(userId, {
      mode: 'human'
    });

    if (shouldNotify(prev)) {

      await notifyAgent(event, {
        lastUserText: '[ผู้ใช้เลือกติดต่อเจ้าหน้าที่]'
      });

      setState(userId, {
        notifiedAt: Date.now()
      });
    }

    return reply(replyToken, {
      type: 'text',
      text:
        '👨‍💼 โหมดเจ้าหน้าที่\n\n' +
        'เชื่อมต่อเจ้าหน้าที่เรียบร้อยแล้ว\n' +
        'กรุณารอสักครู่'
    });
  }

  /* =====================================
   * Cancel Human
   * ===================================== */

  if (params.action === 'cancel_human') {

    setState(userId, {
      mode: 'ai'
    });

    return reply(replyToken, {
      type: 'text',
      text:
        '🤖 AI Assistant\n\n' +
        'กลับเข้าสู่โหมด AI แล้วครับ\n' +
        'สามารถถามคำถามอื่นได้เลย'
    });
  }

  /* =====================================
   * AI Mode
   * ===================================== */

  if (params.mode === 'ai') {

    setState(userId, {
      mode: 'ai'
    });

    return reply(replyToken, {
      type: 'text',
      text:
        '🤖 AI Assistant\n\n' +
        'กลับเข้าสู่โหมด AI แล้วครับ'
    });
  }

  /* =====================================
   * Human Mode
   * ===================================== */

  if (params.mode === 'human') {

    const prev = getState(userId);

    setState(userId, {
      mode: 'human'
    });

    if (shouldNotify(prev)) {

      await notifyAgent(event, {
        lastUserText: '[เลือกติดต่อเจ้าหน้าที่]'
      });

      setState(userId, {
        notifiedAt: Date.now()
      });
    }

    return reply(replyToken, [
      {
        type: 'text',
        text:
          '👨‍💼 โหมดเจ้าหน้าที่\n\n' +
          'เจ้าหน้าที่กำลังดูแลคุณอยู่ครับ กรุณาพิมพ์รายละเอียดเพิ่มเติม'
      },
      backToAIPreset(
        'หากต้องการกลับไปถาม AI กดปุ่มด้านล่าง'
      )
    ]);
  }

  /* =====================================
   * Continue Conversation
   * ===================================== */

  if (params.conv === 'continue') {

    setState(userId, {
      promptedAfterInactive: false
    });

    return reply(
      replyToken,
      backToAIPreset(
        'สามารถกลับไปถาม AI ได้เลยครับ'
      )
    );
  }

  /* =====================================
   * End Conversation
   * ===================================== */

  if (params.conv === 'end') {

    clearConversation(userId);

    return reply(replyToken, {
      type: 'text',
      text:
        'ขอบคุณครับ ระบบได้ปิดการสนทนาแล้ว'
    });
  }
}

module.exports = {
  handlePostback
};
