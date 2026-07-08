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

/* ============================================
 * Conversation Intents
 * ============================================ */

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

const HUMAN_KEYWORDS = [
  'เจ้าหน้าที่',
  'ติดต่อเจ้าหน้าที่',
  'ติดต่อ จนท',
  'จนท',
  'คุยกับเจ้าหน้าที่',
  'ขอเจ้าหน้าที่',
  'ขอคุยกับเจ้าหน้าที่',
  'agent',
  'admin'
];

function isGreeting(text = '') {
  return GREETING_WORDS.includes(text);
}

function isThank(text = '') {
  return THANK_WORDS.includes(text);
}

function wantsHuman(text = '') {
  return HUMAN_KEYWORDS.some(
    keyword => text.includes(keyword)
  );
}

/* ============================================
 * Main
 * ============================================ */

async function handleTextMessage(event) {

  const replyToken = event.replyToken;

  const userId =
    event.source.userId ||
    event.source.groupId ||
    event.source.roomId;

  const userText =
    (event.message.text || '').trim();

  const lowerText =
    userText
      .trim()
      .toLowerCase();

  const state =
    getState(userId) || {};

  console.log(
    '[TEXT]',
    lowerText,
    state
  );

  /* ============================================
   * ติดต่อเจ้าหน้าที่
   * รองรับทุกสถานะ
   * ============================================ */
  
    if (wantsHuman(lowerText)) {
    
      setState(userId, {
        ...state,
        mode: 'human'
      });
    
      return reply(replyToken, {
        type: 'text',
        text:
          '👨‍💼 เชื่อมต่อเจ้าหน้าที่เรียบร้อยแล้ว\n\n' +
          'กรุณาพิมพ์รายละเอียดเพิ่มเติมได้เลยครับ',
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '🤖 กลับไปใช้ D6 Assistant',
                data: 'mode=ai',
                displayText: 'กลับไปใช้ D6 Assistant'
              }
            }
          ]
        }
      });
    }

  /* ============================================
   * Human Mode
   * ============================================ */

if (state.mode === 'human') {

  return reply(replyToken, {
    type: 'text',
    text:
      '👨‍💼 ขณะนี้อยู่ในโหมดเจ้าหน้าที่\n\n' +
      'กรุณารอเจ้าหน้าที่ตอบกลับ\n\n' +
      'หากต้องการกลับมาสอบถามระบบ สามารถกดปุ่มด้านล่างได้ครับ',
    quickReply: {
      items: [
        {
          type: 'action',
          action: {
            type: 'postback',
            label: '🤖 กลับไปใช้ D6 Assistant',
            data: 'mode=ai',
            displayText: 'กลับไปใช้ D6 Assistant'
          }
        }
      ]
    }
  });
}

/* waiting_human_confirm */

if (
  state.mode === 'waiting_human_confirm'
) {

  setState(userId, {
    ...state,
    mode: 'ai'
  });
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
        'สามารถสอบถามเกี่ยวกับการใช้งานระบบได้เลยครับ'
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
        'หากมีคำถามเพิ่มเติมสามารถสอบถามได้เลยครับ'
    });
  }

  /* ============================================
   * RAG Search
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
   * Ask Human First
   * ============================================ */

  setState(userId, {
    ...state,
    mode: 'waiting_human_confirm'
  });

  return reply(replyToken, {
    type: 'text',
    text:
      'ขออภัยครับ\n\n' +
      'ผมยังไม่พบข้อมูลที่ตรงกับคำถามนี้\n\n' +
      'หากต้องการให้ช่วยตรวจสอบเพิ่มเติม สามารถติดต่อเจ้าหน้าที่ได้ครับ',
    quickReply:
      quickReplyConfirmHuman()
  });
}

module.exports = {
  handleTextMessage
};
