// handlers/postbackHandler.js

const { reply } = require('../services/lineClient');

const {
  getState,
  setState,
  clearConversation,
  shouldNotify,
  touch
} = require('../services/stateStore');

const {
  notifyAgent
} = require('../services/notifyAgent');

const {
  parsePostbackData
} = require('../quickreply/router');

const {
  backToAIPreset
} = require('../quickreply/presets');

async function handlePostback(event) {

  const replyToken = event.replyToken;

  const userId =
    event.source.userId ||
    event.source.groupId ||
    event.source.roomId;

  const params =
    parsePostbackData(
      event.postback?.data || ''
    );

  touch(userId);

  console.log(
  '[POSTBACK]',
  event.postback?.data,
  params
);
  /* =====================================
   * ผู้ใช้ยืนยันติดต่อเจ้าหน้าที่
   * ===================================== */

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
          '[ผู้ใช้ร้องขอเจ้าหน้าที่]'
      });

      setState(userId, {
        notifiedAt: Date.now()
      });
    }

    return reply(replyToken, [
      {
        type: 'text',
        text:
          '👨‍💼 เชื่อมต่อเจ้าหน้าที่เรียบร้อยแล้ว\n\n' +
          'กรุณาพิมพ์รายละเอียดเพิ่มเติมได้เลยครับ'
      },
      backToAIPreset()
    ]);
  }

  /* =====================================
   * ผู้ใช้เลือกถามต่อ
   * ===================================== */

  if (
    params.action ===
    'cancel_human'
  ) {

    setState(userId, {
      mode: 'ai',
      lastTopic: null
    });

    return reply(replyToken, {
      type: 'text',
      text:
        'สามารถสอบถามคำถามอื่นได้เลยครับ 😊',
      quickReply: {
        items: [
          {
            type: 'action',
            action: {
              type: 'postback',
              label: '👨‍💼 ติดต่อเจ้าหน้าที่',
              data: 'mode=human',
              displayText: 'ติดต่อเจ้าหน้าที่'
            }
          }
        ]
      }
    });
  }

  /* =====================================
   * กลับ D6 Assistant
   * ===================================== */

  if (params.mode === 'ai') {

    setState(userId, {
      mode: 'ai',
      lastTopic: null
    });

    return reply(replyToken, {
      type: 'text',
      text:
        'สามารถสอบถามคำถามอื่นได้เลยครับ 😊'
    });
  }

  /* =====================================
   * ขอเจ้าหน้าที่โดยตรง
   * ===================================== */

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

    return reply(replyToken, [
      {
        type: 'text',
        text:
          '👨‍💼 เชื่อมต่อเจ้าหน้าที่เรียบร้อยแล้ว\n\n' +
          'กรุณาพิมพ์รายละเอียดเพิ่มเติมได้เลยครับ'
      },
      backToAIPreset()
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
        'สามารถกลับไปใช้ D6 Assistant ได้เลยครับ'
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
        'ขอบคุณครับ 😊\n\n' +
        'หากต้องการสอบถามเพิ่มเติมสามารถกลับมาติดต่อได้เสมอครับ'
    });
  }
}

module.exports = {
  handlePostback
};
