// quickreply/presets.js

/**
 * โหมด D6 Assistant
 */
function quickReplyForAI() {
  return {
    items: [
      {
        type: 'action',
        action: {
          type: 'postback',
          label: '👨‍💼 ติดต่อเจ้าหน้าที่',
          data: 'mode=human',
          displayText: 'ติดต่อเจ้าหน้าที่'
        }
      }
    ]
  };
}

/**
 * โหมดเจ้าหน้าที่
 */
function quickReplyForHuman() {
  return {
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
  };
}

/**
 * AI ตอบไม่ได้
 */
function quickReplyConfirmHuman() {
  return {
    items: [
      {
        type: 'action',
        action: {
          type: 'postback',
          label: '👨‍💼 ติดต่อเจ้าหน้าที่',
          data: 'action=confirm_human',
          displayText: 'ติดต่อเจ้าหน้าที่'
        }
      },
      {
        type: 'action',
        action: {
          type: 'postback',
          label: '❓ ถามคำถามอื่น',
          data: 'action=cancel_human',
          displayText: 'ถามคำถามอื่น'
        }
      }
    ]
  };
}

/**
 * ใช้ตอนอยู่ Human Mode
 */
function backToAIPreset(
  text = 'หากต้องการกลับไปใช้ D6 Assistant กดปุ่มด้านล่าง'
) {
  return {
    type: 'text',
    text,
    quickReply: quickReplyForHuman()
  };
}

function getQuickReplyByMode(mode) {

  if (mode === 'human') {
    return quickReplyForHuman();
  }

  return quickReplyForAI();
}

module.exports = {
  getQuickReplyByMode,
  quickReplyForAI,
  quickReplyForHuman,
  quickReplyConfirmHuman,
  backToAIPreset
};
