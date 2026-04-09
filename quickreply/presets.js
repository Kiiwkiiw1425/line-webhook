// quickreply/presets.js

/**
 * Quick Reply สำหรับโหมด AI
 * แสดงปุ่ม "ติดต่อเจ้าหน้าที่"
 */
function quickReplyForAI() {
  return {
    items: [
      {
        type: 'action',
        action: {
          type: 'postback',
          label: 'ติดต่อเจ้าหน้าที่',
          data: 'mode=human',
          displayText: 'ติดต่อเจ้าหน้าที่'
        }
      }
    ]
  };
}

/**
 * Quick Reply สำหรับโหมด Human
 * แสดงปุ่ม "ถามตอบด้วย AI"
 */
function quickReplyForHuman() {
  return {
    items: [
      {
        type: 'action',
        action: {
          type: 'postback',
          label: 'ถามตอบด้วย AI',
          data: 'mode=ai',
          displayText: 'ถามตอบด้วย AI'
        }
      }
    ]
  };
}

/**
 * เลือก Quick Reply ตามโหมด
 */
function getQuickReplyByMode(mode) {
  if (mode === 'human') return quickReplyForHuman();
  return quickReplyForAI(); // default = AI mode
}

module.exports = {
  getQuickReplyByMode,
  quickReplyForAI,
  quickReplyForHuman
};
