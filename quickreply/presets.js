// quickreply/presets.js
const { textWithQuickReply, postbackAction } = require('./builder');

/**
 * ✅ ปุ่มสลับโหมด (AI / เจ้าหน้าที่)
 * ใช้เป็นแกนกลางของทุก Quick Reply
 */
function modeSwitchItems() {
  return [
    postbackAction('🤖 ถามตอบด้วย AI', 'mode=ai', 'ถามตอบด้วย AI'),
    postbackAction('👩‍💼 ติดต่อเจ้าหน้าที่', 'mode=human', 'ติดต่อเจ้าหน้าที่')
  ];
}

/**
 * ✅ ใช้เวลาอยาก "แนบปุ่มโหมด" ไปกับข้อความใดก็ตาม
 */
function withModeSwitch(text) {
  return textWithQuickReply(text, modeSwitchItems());
}

/**
 * ✅ ใช้ตอนบอทยังไม่แน่ใจ / อยากให้ผู้ใช้เลือกเอง
 */
function helpModePreset(text = 'กรุณาเลือกโหมดการใช้งาน') {
  return textWithQuickReply(text, modeSwitchItems());
}

/**
 * ✅ ใช้เฉพาะตอนอยู่ human mode
 * เพื่อให้มีปุ่ม "กลับไปถาม AI"
 */
function backToAIPreset(text = 'ต้องการกลับไปถาม AI หรือไม่') {
  return textWithQuickReply(text, [
    postbackAction('🤖 กลับไปถาม AI', 'mode=ai', 'กลับไปถาม AI')
  ]);
}

module.exports = {
  helpModePreset,
  backToAIPreset,
  withModeSwitch // ⭐ ตัวหลักที่เราจะใช้
};
