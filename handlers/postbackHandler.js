// handlers/postbackHandler.js
const { reply } = require('../services/lineClient');
const { retrieve } = require('../services/ragStore');
const { parsePostbackData } = require('../quickreply/router');

async function handlePostback(event) {
  const replyToken = event.replyToken;
  const params = parsePostbackData(event.postback?.data || '');

  // ✅ ปุ่มอ่านต่อ
  if (params.readmore === 'DPIS6-Registration') {
    const hits = await retrieve('ขั้นตอนลงทะเบียน');

    const fullText = hits
      .map((h, i) => `ขั้นตอนที่ ${i + 1}\n${h.content}`)
      .join('\n\n');

    return reply(replyToken, {
      type: 'text',
      text: fullText
    });
  }
}

module.exports = { handlePostback };
