// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const {
  getState,
  setState,
  shouldNotify
} = require('../services/stateStore');

const { retrieve } = require('../services/ragStore');
const { askAI } = require('../services/aiService.gemini');
const { notifyAgent } = require('../services/notifyAgent');

const {
  getQuickReplyByMode,
  quickReplyConfirmHuman
} = require('../quickreply/presets');

/* =====================================
 * Utils
 * ===================================== */

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
  return ACK_WORDS.includes(
    text.trim().toLowerCase()
  );
}

function summarizeFromRag(hits) {
  return hits
    .map(
      h =>
        `• ${h.title}\n${h.content}`
    )
    .join('\n\n');
}

function aiPrefix(text) {
  return `🤖 AI Assistant\n\n${text}`;
}

function humanPrefix(text) {
  return `👨‍💼 โหมดเจ้าหน้าที่\n\n${text}`;
}

/* =====================================
 * Main Handler
 * ===================================== */

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

  /* =========================
   * Manual Switch to Human
   * ========================= */

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
      text: humanPrefix(
        'เชื่อมต่อเจ้าหน้าที่เรียบร้อยแล้ว\n\nกรุณารอเจ้าหน้าที่ตอบกลับ'
      ),
      quickReply: getQuickReplyByMode('human')
    });
  }

  /* =========================
   * Manual Switch to AI
   * ========================= */

  if (lowerText === '#bot') {

    setState(userId, {
      mode: 'ai'
    });

    return reply(replyToken, {
      type: 'text',
      text: aiPrefix(
        'กลับเข้าสู่โหมด AI แล้วครับ\n\nสามารถสอบถามข้อมูลได้เลย'
      ),
      quickReply: getQuickReplyByMode('ai')
    });
  }

  /* =========================
   * Human Mode
   * ========================= */

  if (state.mode === 'human') {
    return;
  }

  /* =========================
   * Waiting Confirm Mode
   * ========================= */

  if (
    state.mode === 'waiting_human_confirm'
  ) {

    setState(userId, {
      mode: 'ai'
    });
  }

  /* =========================
   * ACK
   * ========================= */

  if (isAckOnly(lowerText)) {

    return reply(replyToken, {
      type: 'text',
      text: aiPrefix(
        'ยินดีให้บริการครับ 😊'
      ),
      quickReply: getQuickReplyByMode('ai')
    });
  }

const GREETING_WORDS = [
  'สวัสดี',
  'สวัสดีครับ',
  'สวัสดีค่ะ',
  'ดีครับ',
  'ดีค่ะ',
  'hello',
  'hi',
  'hey'
];

const THANK_WORDS = [
  'ขอบคุณ',
  'ขอบคุณครับ',
  'ขอบคุณค่ะ',
  'thank you',
  'thanks'
];

const GOODBYE_WORDS = [
  'บาย',
  'ลาก่อน',
  'ขอบคุณมาก',
  'โอเคครับ ขอบคุณ',
  'โอเค ขอบคุณ'
];

function isGreeting(text = '') {
  return GREETING_WORDS.includes(text.trim().toLowerCase());
}

function isThank(text = '') {
  return THANK_WORDS.includes(text.trim().toLowerCase());
}

function isGoodbye(text = '') {
  return GOODBYE_WORDS.includes(text.trim().toLowerCase());
}
  
  /* =========================
   * RAG Search
   * ========================= */

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
          text: aiPrefix(
            result.answer
          ),
          quickReply:
            getQuickReplyByMode('ai')
        });
      }

      return reply(replyToken, {
        type: 'text',
        text: aiPrefix(
          summarizeFromRag(hits)
        ),
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
        text: aiPrefix(
          summarizeFromRag(hits)
        ),
        quickReply:
          getQuickReplyByMode('ai')
      });
    }
  }

  /* =========================
   * Gemini Fallback
   * ========================= */

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
        text: aiPrefix(
          result.answer
        ),
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

  /* =========================
   * Ask Before Human
   * ========================= */

  setState(userId, {
    mode: 'waiting_human_confirm'
  });

  return reply(replyToken, {
    type: 'text',
    text:
      '🤖 AI Assistant\n\n' +
      'ขออภัยครับ ผมยังไม่พบข้อมูลในหัวข้อนี้\n\n' +
      'ต้องการติดต่อเจ้าหน้าที่เพื่อช่วยตรวจสอบเพิ่มเติมหรือไม่ครับ',
    quickReply:
      quickReplyConfirmHuman()
  });
}

module.exports = {
  handleTextMessage
};
