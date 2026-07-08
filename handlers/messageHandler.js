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

const SMALL_TALK = [
  'เป็นไง',
  'เป็นยังไง',
  'สบายดีไหม',
  'เหนื่อยไหม'
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

function isSmallTalk(text = '') {
  return SMALL_TALK.includes(text);
}

function summarizeFromRag(hits) {
  return hits
    .map(
      h => `• ${h.title}\n${h.content}`
    )
    .join('\n\n');
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
   * Force Back To AI
   * ============================================ */

  if (lowerText === '#bot') {

    setState(userId, {
      mode: 'ai',
      lastTopic: null
    });

    return reply(replyToken, {
      type: 'text',
      text:
        'สามารถสอบถามคำถามอื่นได้เลยครับ 😊',
      quickReply:
        getQuickReplyByMode('ai')
    });
  }

  /* ============================================
   * waiting_human_confirm
   * ถ้าผู้ใช้ถามใหม่ = กลับ AI
   * ============================================ */

  if (
    state.mode === 'waiting_human_confirm'
  ) {

    setState(userId, {
      mode: 'ai'
    });
  }

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
        'สวัสดีครับ 😊\n\n' +
        'วันนี้มีเรื่องไหนให้ช่วยไหมครับ\n' +
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
        'ยินดีครับ 😊\n\n' +
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
        'ยินดีที่ได้ช่วยเหลือครับ 😊\n\n' +
        'หากต้องการสอบถามเพิ่มเติมสามารถติดต่อมาได้ทุกเมื่อครับ'
    });
  }

  /* ============================================
   * Small Talk
   * ============================================ */

  if (isSmallTalk(lowerText)) {

    return reply(replyToken, {
      type: 'text',
      text:
        'ผมพร้อมช่วยเหลือเรื่องการใช้งานระบบ DPIS6 ครับ 😊\n\n' +
        'กำลังพบปัญหาหรือต้องการสอบถามเรื่องไหนเป็นพิเศษไหมครับ'
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
        '👨‍💼 เชื่อมต่อเจ้าหน้าที่เรียบร้อยแล้ว\n\n' +
        'กรุณาพิมพ์รายละเอียดเพิ่มเติมได้เลยครับ',
      quickReply:
        getQuickReplyByMode('human')
    });
  }

  /* ============================================
   * Search RAG
   * ============================================ */

  const hits =
    await retrieve(userText, state);

  if (hits.length > 0) {

    setState(userId, {
      mode: 'ai',
      lastTopic:
        hits[0].category || null
    });

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

      return reply(replyToken, {
        type: 'text',
        text:
          summarizeFromRag(hits),
        quickReply:
          getQuickReplyByMode('ai')
      });

    } catch (err) {

      console.error(
        '[Gemini Error]',
        err.message
      );

      return reply(replyToken, {
        type: 'text',
        text:
          summarizeFromRag(hits),
        quickReply:
          getQuickReplyByMode('ai')
      });
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
      'ขออภัยครับ\n\n' +
      'ผมยังไม่พบข้อมูลที่ตรงกับคำถามนี้ในขณะนี้\n\n' +
      'หากต้องการให้ช่วยตรวจสอบเพิ่มเติม สามารถติดต่อเจ้าหน้าที่ได้ครับ',
    quickReply:
      quickReplyConfirmHuman()
  });
}

module.exports = {
  handleTextMessage
};
