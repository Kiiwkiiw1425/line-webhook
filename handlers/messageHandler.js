// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const { getState, setState, shouldNotify } = require('../services/stateStore');
const { retrieve } = require('../services/ragStore');
const { askAI } = require('../services/aiService.gemini');
const { notifyAgent } = require('../services/notifyAgent');
const { getQuickReplyByMode } = require('../quickreply/presets');

/* =================================================
 * Utils
 * ================================================= */

const ACK_WORDS = [
  'ครับ',
  'ค่ะ',
  'โอเค',
  'ok',
  'เข้าใจแล้ว',
  'ได้ครับ',
  'ขอบคุณ',
  'ขอบคุณครับ',
  'thanks'
];

function isAckOnly(text = '') {
  return ACK_WORDS.includes(text.trim().toLowerCase());
}

function summarizeFromRag(hits) {
  return hits
    .map(h => `• ${h.title}\n${h.content}`)
    .join('\n\n');
}

/* =================================================
 * Main handler
 * ================================================= */

async function handleTextMessage(event) {

  const replyToken = event.replyToken;

  const userId =
    event.source.userId ||
    event.source.groupId ||
    event.source.roomId;

  const userText = (event.message.text || '').trim();
  const lowerText = userText.toLowerCase();

  const state = getState(userId) || {};

  /* =============================================
   * Switch Human Mode
   * ============================================= */

  if (
    lowerText === '#admin' ||
    lowerText === 'เจ้าหน้าที่' ||
    lowerText === 'ติดต่อเจ้าหน้าที่' ||
    lowerText === 'คุยกับเจ้าหน้าที่'
  ) {

    setState(userId, {
      mode: 'human'
    });

    if (shouldNotify(state)) {

      await notifyAgent(event, {
        lastUserText: userText
      });

      setState(userId, {
        notifiedAt: Date.now()
      });
    }

    return reply(replyToken, {
      type: 'text',
      text:
        '✅ เชื่อมต่อเจ้าหน้าที่เรียบร้อยแล้ว\n\n' +
        'ระหว่างนี้ระบบจะหยุดตอบอัตโนมัติ กรุณารอเจ้าหน้าที่ตอบกลับ',
      quickReply: getQuickReplyByMode('human')
    });
  }

  /* =============================================
   * Switch AI Mode
   * ============================================= */

  if (lowerText === '#bot') {

    setState(userId, {
      mode: 'ai'
    });

    return reply(replyToken, {
      type: 'text',
      text:
        '✅ กลับเข้าสู่โหมด AI แล้วครับ\n\n' +
        'สามารถสอบถามข้อมูลได้เลย',
      quickReply: getQuickReplyByMode('ai')
    });
  }

  /* =============================================
   * ACK
   * ============================================= */

  if (isAckOnly(lowerText)) {
    return;
  }

  /* =============================================
   * Human Mode
   * ============================================= */

  if (state.mode === 'human') {
    return;
  }

  /* =============================================
   * RAG Search
   * ============================================= */

  const hits = await retrieve(userText, state);

  /* =============================================
   * มีข้อมูลใน RAG
   * ============================================= */

  if (hits.length > 0) {

    setState(userId, {
      mode: 'ai',
      lastTopic: hits[0].category
    });

    try {

      const result = await askAI(
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
          quickReply: getQuickReplyByMode('ai')
        });
      }

      return reply(replyToken, {
        type: 'text',
        text:
          'จากคู่มือของระบบ พบข้อมูลที่เกี่ยวข้องดังนี้\n\n' +
          summarizeFromRag(hits),
        quickReply: getQuickReplyByMode('ai')
      });

    } catch (err) {

      console.error(
        '[Gemini Error]',
        err.message
      );

      return reply(replyToken, {
        type: 'text',
        text:
          'จากคู่มือของระบบ พบข้อมูลที่เกี่ยวข้องดังนี้\n\n' +
          summarizeFromRag(hits),
        quickReply: getQuickReplyByMode('ai')
      });
    }
  }

  /* =============================================
   * ไม่มีข้อมูลใน RAG
   * ลอง Gemini ก่อน
   * ============================================= */

  try {

    const result = await askAI(
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
        quickReply: getQuickReplyByMode('ai')
      });
    }

  } catch (err) {

    console.error(
      '[Gemini Fallback Error]',
      err.message
    );
  }

  /* =============================================
   * AI ตอบไม่ได้จริง
   * ส่งต่อเจ้าหน้าที่
   * ============================================= */

  setState(userId, {
    mode: 'human'
  });

  if (shouldNotify(state)) {

    await notifyAgent(event, {
      lastUserText: userText
    });

    setState(userId, {
      notifiedAt: Date.now()
    });
  }

  return reply(replyToken, {
    type: 'text',
    text:
      'ขออภัยครับ ผมยังไม่สามารถตอบคำถามนี้ได้\n\n' +
      'ระบบได้ส่งเรื่องต่อให้เจ้าหน้าที่แล้ว กรุณารอสักครู่',
    quickReply: getQuickReplyByMode('human')
  });
}

module.exports = {
  handleTextMessage
};
