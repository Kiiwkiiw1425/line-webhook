// quickreply/presets.js
const { textWithQuickReply, postbackAction } = require('./builder');

function helpModePreset(text = 'ต้องการให้ผมช่วยแบบไหนครับ') {
  const items = [
    postbackAction('ถามตอบด้วย AI', 'mode=ai', 'ถามตอบด้วย AI'),
    postbackAction('ติดต่อเจ้าหน้าที่', 'mode=human', 'ติดต่อเจ้าหน้าที่'),
  ];
  return textWithQuickReply(text, items);
}

function backToAIPreset(text = 'ต้องการกลับไปถาม AI หรือไม่') {
  const items = [
    postbackAction('กลับไปถาม AI', 'mode=ai', 'กลับไปถาม AI'),
  ];
  return textWithQuickReply(text, items);
}

// ⬇️ สำคัญ: export ครั้งเดียว ครบทุกฟังก์ชัน
module.exports = { helpModePreset, backToAIPreset };
