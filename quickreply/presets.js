// quickreply/presets.js

/**
 * AI Mode
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
 * Human Mode
 */
function quickReplyForHuman() {
  return {
    items: [
      {
        type: 'action',
        action: {
          type: 'postback',
          label: '🤖 ถามตอบด้วย AI',
          data: 'mode=ai',
          displayText: 'ถามตอบด้วย AI'
        }
      }
    ]
  };
}

/**
 * AI หาไม่เจอ → ถามผู้ใช้ก่อน
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
          label: '🤖 ถามคำถามอื่น',
          data: 'action=cancel_human',
          displayText: 'ถามคำถามอื่น'
        }
      }
    ]
  };
}

/**
 * ใช้ใน postbackHandler เดิม
 */
function backToAIPreset(
  text = 'หากต้องการกลับไปถาม AI กดปุ่มด้านล่าง'
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
