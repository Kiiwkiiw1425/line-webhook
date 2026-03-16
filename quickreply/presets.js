// quickreply/presets.js
const { textWithQuickReply, postbackAction } = require('./builder');

// พรีเซ็ต: เลือกโหมดช่วยเหลือ (AI/Human)
function helpModePreset(text = 'ต้องการให้ผมช่วยแบบไหนครับ') {
  const items = [
    postbackAction('ถามตอบด้วย AI', 'mode=ai', 'ถามตอบด้วย AI'),
    postbackAction('ติดต่อเจ้าหน้าที่', 'mode=human', 'ติดต่อเจ้าหน้าที่'),
  ];
  return textWithQuickReply(text, items);
}

// เพิ่ม preset อื่น ๆ ได้ เช่น เลือกหมวด, เลือกภาษา, เลือกเวลานัดหมาย ฯลฯ

module.exports = { helpModePreset };
