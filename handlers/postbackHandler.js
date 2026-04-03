// handlers/postbackHandler.js

const { reply } = require('../services/lineClient');
const { getState, setState, clearConversation, shouldNotify, touch } =
  require('../services/stateStore');
const { notifyAgent } = require('../services/notifyAgent');
const { parsePostbackData } = require('../quickreply/router');
const { backToAIPreset } = require('../quickreply/presets');

async function handlePostback(event) {
  const replyToken = event.replyToken;
  const userId =
    event.source.userId || event.source.groupId || event.source.roomId;

  const params = parsePostbackData(event.postback?.data || '');
  touch(userId);

  // ========= สลับโหมด =========
      if (params.mode === 'ai') {
      setState(userId, { mode: 'ai' });
      return reply(replyToken, {
        type: 'text',
        text: 'กลับเข้าสู่โหมด AI แล้วครับ พิมพ์คำถามได้เลย'
      });
    }

    if (params.mode === 'human') {
      setState(userId, { mode: 'human' });
    
      return reply(replyToken, [
        {
          type: 'text',
          text: 'เจ้าหน้าที่กำลังดูแลคุณอยู่ครับ กรุณาพิมพ์รายละเอียด'
        },
        backToAIPreset('หากต้องการกลับไปถาม AI กดปุ่มด้านล่าง')
      ]);
    }

    return reply(replyToken, [
      { type: 'text', text: 'เจ้าหน้าที่กำลังดูแลคุณอยู่ครับ กรุณาพิมพ์รายละเอียด' },
      backToAIPreset('หากต้องการกลับไปถาม AI กดปุ่มด้านล่าง')
    ]);
  }

  // ========= inactivity =========
  if (params.conv === 'continue') {
    setState(userId, { promptedAfterInactive: false });
    return reply(replyToken, backToAIPreset('สามารถกลับไปถาม AI ได้เลยครับ'));
  }

  if (params.conv === 'end') {
    clearConversation(userId);
    return reply(replyToken, {
      type: 'text',
      text: 'ขอบคุณครับ ระบบได้ปิดการสนทนาแล้ว'
    });
  }
}

module.exports = { handlePostback };
