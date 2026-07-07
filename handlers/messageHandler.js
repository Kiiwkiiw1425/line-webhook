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
const { getQuickReplyByMode } = require('../quickreply/presets');

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
 * Main
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

  /* ========================
   * Switch Human
   * ======================== */

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
        'เชื่อมต่อเจ้าหน้าที่เรียบร้อยแล้ว\n\nระหว่างนี้ระบบ AI จะหยุดตอบชั่วคราว'
      ),
      quickReply:
        getQuickReplyByMode('human')
    });
  }

  /* ========================
   * Switch AI
   * ======================== */

  if (lowerText === '#bot') {

    setState(userId, {
      mode: 'ai'
    });

    return reply(replyToken, {
      type: 'text',
      text: aiPrefix(
        'กลับเข้าสู่โหมด AI แล้วครับ\n\nสามารถสอบถามข้อมูลได้เลย'
      ),
      quickReply:
        getQuickReplyByMode('ai')
    });
  }

  /* ========================
   * HUMAN MODE
   * ======================== */

  if (state.mode === 'human') {

    return reply(replyToken, {
      type: 'text',
      text: humanPrefix(
        'ขณะนี้กำลังอยู่ในโหมดเจ้าหน้าที่\n\nหากต้องการกลับไปใช้ AI กดปุ่มด้านล่าง'
      ),
      quickReply:
        getQuickReplyByMode('human')
    });
  }

  /* ========================
   * ACK
   * ======================== */

  if (isAckOnly(lowerText)) {

    return reply(replyToken, {
      type: 'text',
      text: aiPrefix(
        'ยินดีให้บริการครับ 😊'
      ),
      quickReply:
        getQuickReplyByMode('ai')
    });
  }

  /* ========================
   * RAG
   * ======================== */

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
        'Gemini Error:',
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

  /* ========================
   * Gemini Only
   * ======================== */

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
      'Gemini Fallback:',
      err.message
    );
  }

  /* ========================
   * Fail => Human
   * ======================== */

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
      'AI ยังไม่สามารถตอบคำถามนี้ได้\n\nระบบได้ส่งเรื่องต่อให้เจ้าหน้าที่แล้ว'
    ),
    quickReply:
      getQuickReplyByMode('human')
  });
}

module.exports = {
  handleTextMessage
};
