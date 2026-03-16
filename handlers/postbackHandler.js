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
    return reply(replyToken, { type: 'text', text: 'เข้าสู่โหมด AI แล้วครับ พิมพ์คำถามได้เลย' });
  }
  if (params.mode === 'human') {
    setState(userId, { mode: 'human' });
    // แจ้งเจ้าหน้าที่/สร้าง ticket ถ้าต้องการ
    return reply(replyToken, [
      { type: 'text', text: 'รับเรื่องติดต่อเจ้าหน้าที่เรียบร้อยครับ' },
      backToAIPreset('หากต้องการกลับไปถาม AI กดปุ่มด้านล่างได้ครับ')
    ]);
  }

module.exports = { handlePostback };
