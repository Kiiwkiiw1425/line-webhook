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

  if (params.mode === 'ai') {

    setState(userId, {
      mode: 'ai'
    });

    return reply(replyToken, {
      type: 'text',
      text: '✅ กลับเข้าสู่โหมด AI แล้วครับ'
    });
  }

  if (params.mode === 'human') {

    const prevState = getState(userId);

    setState(userId, {
      mode: 'human'
    });

    if (shouldNotify(prevState)) {

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
          '✅ เชื่อมต่อเจ้าหน้าที่เรียบร้อยแล้ว\n\n' +
          'กรุณาพิมพ์รายละเอียดเพิ่มเติมได้เลยครับ'
      },
      backToAIPreset(
        'หากต้องการกลับไปถาม AI กดปุ่มด้านล่าง'
      )
    ]);
  }

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
