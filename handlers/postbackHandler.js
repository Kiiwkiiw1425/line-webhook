// handlers/postbackHandler.js
const { reply } = require('../services/lineClient');
const { setState } = require('../services/stateStore');
const { notifyAgent } = require('../services/notifyAgent');
const { parsePostbackData } = require('../quickreply/router');

async function handlePostback(event) {
  const replyToken = event.replyToken;
  const userId = event.source.userId;
  const data = event.postback?.data || '';
  const params = parsePostbackData(data);

  // ตัวอย่าง: โหมด AI / Human
  if (params.mode === 'ai') {
    setState(userId, { mode: 'ai' });
    return reply(replyToken, {
      type: 'text',
      text: 'กลับเข้าสู่โหมด AI แล้วครับ พิมพ์คำถามได้เลย'
    });
  }
  
  if (params.mode === 'human') {
    setState(userId, { mode: 'human' });
    const ref = await notifyAgent(event, { lastUserText: '[เลือกจาก Quick Reply]' });
    return reply(replyToken, [
      { type: 'text', text: `รับเรื่องเรียบร้อย (อ้างอิง ${ref})` },
      { type: 'text', text: 'เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุดครับ' },
    ]);
  }

  // เพิ่มเคสอื่น ๆ ได้ เช่น cat=..., lang=..., confirm=...
  return reply(replyToken, { type: 'text', text: 'รับทราบครับ' });
}



module.exports = { handlePostback };
