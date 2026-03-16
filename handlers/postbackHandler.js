// handlers/postbackHandler.js
const { reply } = require('../services/lineClient');
const { setState } = require('../services/stateStore');
const { notifyAgent } = require('../services/notifyAgent');
const { parsePostbackData } = require('../quickreply/router');
const { backToAIPreset, helpModePreset } = require('../quickreply/presets');

async function handlePostback(event) {
  try {
    const replyToken = event.replyToken;
    const userId =
      event.source.userId || event.source.groupId || event.source.roomId || 'unknown';
    const data = event.postback?.data || '';
    const params = parsePostbackData(data);

    // --- โหมด AI ---
    if (params.mode === 'ai') {
      setState(userId, { mode: 'ai' });
      return reply(replyToken, {
        type: 'text',
        text: 'เข้าสู่โหมด AI แล้วครับ พิมพ์คำถามได้เลย'
      });
    }

    // --- โหมด Human ---
    if (params.mode === 'human') {
      setState(userId, { mode: 'human' });

      // สร้าง ticket/แจ้งทีมงาน (ปรับ notifyAgent ตามระบบจริงของคุณ)
      const ref = await notifyAgent(event, { lastUserText: '[เลือกจาก Quick Reply]' });

      return reply(replyToken, [
        { type: 'text', text: `รับเรื่องติดต่อเจ้าหน้าที่เรียบร้อยครับ (อ้างอิง: ${ref})` },
        backToAIPreset('หากต้องการกลับไปถาม AI กดปุ่มด้านล่างได้ครับ')
      ]);
    }

    // --- ตัวอย่าง postback อื่น ๆ : เลือกหมวดด้วย cat=xxx ---
    if (params.cat) {
      // คุณสามารถยิงเมนูหมวดจาก manual/ ได้ เช่น cat=login, cat=report ฯลฯ
      const categoryMenus = require('../manual');
      if (categoryMenus[params.cat]) {
        return reply(replyToken, categoryMenus[params.cat]);
      }
    }

    // --- ไม่เข้าเงื่อนไขใดเลย → กันเงียบด้วย fallback ---
    return reply(
      replyToken,
      helpModePreset('รับทราบครับ เลือกโหมดช่วยเหลือด้านล่างได้เลย')
    );
  } catch (err) {
    console.error('[postbackHandler] error:', err);
    // พยายามตอบกลับผู้ใช้เพื่อกันเงียบ
    if (event.replyToken) {
      try {
        await reply(event.replyToken, {
          type: 'text',
          text: 'ขออภัย ระบบขัดข้องชั่วคราวครับ'
        });
      } catch (e) {}
    }
  }
}

module.exports = { handlePostback };
