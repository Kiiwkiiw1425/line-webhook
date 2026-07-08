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

  if (
    params.action === 'confirm_human' ||
    params.mode === 'human'
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

  if (
    params.action === 'cancel_human'
  ) {

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

  if (params.conv === 'end') {

    clearConversation(userId);

    return reply(replyToken, {
      type: 'text',
      text:
        'ขอบคุณครับ 😊'
    });
  }
}

module.exports = {
  handlePostback
};
