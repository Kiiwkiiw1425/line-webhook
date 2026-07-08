// handlers/postbackHandler.js

const { reply } = require('../services/lineClient');

const {
  getState,
  setState,
  clearConversation,
  shouldNotify,
  touch
} = require('../services/stateStore');

const { notifyAgent } =
  require('../services/notifyAgent');

const { parsePostbackData } =
  require('../quickreply/router');

const { backToAIPreset } =
  require('../quickreply/presets');

async function handlePostback(event) {

  const replyToken =
    event.replyToken;

  const userId =
    event.source.userId ||
    event.source.groupId ||
    event.source.roomId;

  const params =
    parsePostbackData(
      event.postback?.data || ''
    );

  touch(userId);

  /* ======================================
   * Confirm Human
   * ====================================== */

  if (
    params.action ===
    'confirm_human'
  ) {

    const prev =
      getState(userId);

    setState(userId, {
      mode: 'human'
    });

    if (shouldNotify(prev)) {

      await notifyAgent(event, {
        lastUserText:
          '[ผู้ใช้เลือกติดต่อเจ้าหน้าที่]'
      });

      setState(userId, {
        notifiedAt: Date.now()
      });
    }

    return reply(replyToken, {
      type: 'text',
      text:
        '👨‍💼 เชื่อมต่อเจ้าหน้าที่เรียบร้อยแล้ว\n' +
        'กรุณาพิมพ์รายละเอียดเพิ่มเติมได้เลยครับ'
    });
  }

  /* ======================================
   * Cancel Human
   * ====================================== */

  if (
    params.action ===
    'cancel_human'
  ) {

    setState(userId, {
      mode: 'ai'
    });

    return reply(replyToken, {
      type: 'text',
      text:
        'สามารถสอบถามคำถามอื่นได้เลยครับ 😊'
    });
  }

  /* ======================================
   * Switch AI Mode
   * ====================================== */

  if (params.mode === 'ai') {

    setState(userId, {
      mode: 'ai'
    });

    return reply(replyToken, {
      type: 'text',
      text:
        'สามารถสอบถามคำถามอื่นได้เลยครับ 😊'
    });
  }

  /* ======================================
   * Switch Human Mode
   * ====================================== */

  if (params.mode === 'human') {

    const prev =
      getState(userId);

    setState(userId, {
      mode: 'human'
    });

    if (shouldNotify(prev)) {

      await notifyAgent(event, {
        lastUserText:
          '[เลือกติดต่อเจ้าหน้าที่]'
      });

      setState(userId, {
        notifiedAt: Date.now()
      });
    }

    return reply(replyToken, {
      type: 'text',
      text:
        '👨‍💼 เชื่อมต่อเจ้าหน้าที่เรียบร้อยแล้ว\n' +
        'กรุณาพิมพ์รายละเอียดเพิ่มเติมได้เลยครับ'
    });
  }

  /* ======================================
   * Continue Conversation
   * ====================================== */

  if (
    params.conv ===
    'continue'
  ) {

    setState(userId, {
      promptedAfterInactive: false
    });

    return reply(
      replyToken,
      backToAIPreset(
        'สามารถสอบถามเพิ่มเติมได้เลยครับ 😊'
      )
    );
  }

  /* ======================================
   * End Conversation
   * ====================================== */

  if (params.conv === 'end') {

    clearConversation(userId);

    return reply(replyToken, {
      type: 'text',
      text:
        'ขอบคุณครับ 😊\n' +
        'หากต้องการสอบถามเพิ่มเติมสามารถติดต่อมาได้ทุกเมื่อครับ'
    });
  }
}

module.exports = {
  handlePostback
};
