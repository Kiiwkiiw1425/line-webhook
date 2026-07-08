// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const {
  getState,
  setState
} = require('../services/stateStore');

const { retrieve } = require('../services/ragStore');
const { askAI } = require('../services/aiService.gemini');

const {
  getQuickReplyByMode,
  quickReplyConfirmHuman
} = require('../quickreply/presets');

/* =================================================
 * Conversation Intents
 * ================================================= */

const GREETING_WORDS = [
  'สวัสดี',
  'สวัสดีครับ',
  'สวัสดีค่ะ',
  'hello',
  'hi',
  'hey'
];

const THANK_WORDS = [
  'ขอบคุณ',
  'ขอบคุณครับ',
  'ขอบคุณค่ะ',
  'thanks',
  'thank you'
];

const GOODBYE_WORDS = [
  'บาย',
  'ลาก่อน',
  'ขอบคุณมาก',
  'ไว้คุยใหม่'
];

function isGreeting(text = '') {
  return GREETING_WORDS.includes(text);
}

function isThank(text = '') {
  return THANK_WORDS.includes(text);
}

function isGoodbye(text = '') {
  return GOODBYE_WORDS.includes(text);
}

/* =================================================
 * Main
 * ================================================= */

async function handleTextMessage(event) {

  const replyToken = event.replyToken;

  const userId =
    event.source.userId ||
    event.source.groupId ||
    event.source.roomId;

  const userText =
    (event.message.text || '').trim();

  const lowerText =
    userText.toLowerCase();

  const state =
    getState(userId) || {};

  /* ============================================
   * Human Mode
   * ============================================ */

  if (state.mode === 'human') {
    return;
  }

  /* ============================================
   * Greeting
   * ============================================ */

  if (isGreeting(lowerText)) {

    return reply(replyToken, {
      type: 'text',
      text:
        'สวัสดีครับ 😊\n' +
        'มีอะไรให้ช่วยไหมครับ\n' +
        'สามารถสอบถามเกี่ยวกับการใช้งานระบบ DPIS6 ได้เลยครับ'
    });
  }

  /* ============================================
   * Thank You
   * ============================================ */

  if (isThank(lowerText)) {

    return reply(replyToken, {
      type: 'text',
      text:
        'ยินดีครับ 😊\n' +
        'หากมีคำถามเพิ่มเติมสามารถสอบถามได้เสมอครับ'
    });
  }

  /* ============================================
   * Goodbye
   * ============================================ */

  if (isGoodbye(lowerText)) {

    return reply(replyToken, {
      type: 'text',
      text:
        'ยินดีที่ได้ช่วยเหลือครับ 😊\n' +
        'หากต้องการสอบถามเพิ่มเติมสามารถติดต่อมาได้ทุกเมื่อครับ'
    });
  }

  /* ============================================
   * Explicit Human Request
   * ============================================ */

  if (
    lowerText === 'เจ้าหน้าที่' ||
    lowerText === 'ติดต่อเจ้าหน้าที่' ||
    lowerText === 'คุยกับเจ้าหน้าที่'
  ) {

    setState(userId, {
      mode: 'human'
    });

    return reply(replyToken, {
      type: 'text',
      text:
        '👨‍💼 เชื่อมต่อเจ้าหน้าที่เรียบร้อยแล้ว\n' +
        'กรุณาพิมพ์รายละเอียดเพิ่มเติมได้เลยครับ',
      quickReply: getQuickReplyByMode('human')
    });
  }

  /* ============================================
   * Search RAG
   * ============================================ */

  const hits =
    await retrieve(userText, state);

  if (hits.length > 0) {

    try {

      const result =
        await askAI(
          userText,
          [],
          hits
        );

      if (
        result.answer &&
        !result.failed
      ) {

        return reply(replyToken, {
          type: 'text',
          text: result.answer,
          quickReply:
            getQuickReplyByMode('ai')
        });
      }

    } catch (err) {

      console.error(
        '[Gemini Error]',
        err.message
      );
    }
  }

  /* ============================================
   * Gemini Fallback
   * ============================================ */

  try {

    const result =
      await askAI(
        userText,
        [],
        []
      );

    if (
      result.answer &&
      !result.failed
    ) {

      return reply(replyToken, {
        type: 'text',
        text: result.answer,
        quickReply:
          getQuickReplyByMode('ai')
      });
    }

  } catch (err) {

    console.error(
      '[Gemini Fallback]',
      err.message
    );
  }

  /* ============================================
   * Ask Before Human
   * ============================================ */

  setState(userId, {
    mode: 'waiting_human_confirm'
  });

  return reply(replyToken, {
    type: 'text',
    text:
      'ขออภัยครับ\n' +
      'ผมยังไม่พบข้อมูลที่ตรงกับคำถามนี้ในขณะนี้\n' +
      'หากต้องการให้ช่วยตรวจสอบเพิ่มเติม สามารถติดต่อเจ้าหน้าที่ได้ครับ',
    quickReply:
      quickReplyConfirmHuman()
  });
}

module.exports = {
  handleTextMessage
};
