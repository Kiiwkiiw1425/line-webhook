// quickreply/presets.js
const { textWithQuickReply, postbackAction } = require('./builder');

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
          label: '👩‍💼 ติดต่อเจ้าหน้าที่',
          data: 'mode=human'
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
          label: '🤖 ถามตอบด้วย AI',
          data: 'mode=ai'
        }
      }
    ]
  };
}

/**
 * ฟังก์ชันกลาง — เลือกปุ่มตามโหมด
 */
function getQuickReplyByMode(mode) {
  if (mode === 'human') return quickReplyForHuman();
  return quickReplyForAI(); // default เป็น AI mode
}

module.exports = {
  getQuickReplyByMode,
  quickReplyForAI,
  quickReplyForHuman
};
