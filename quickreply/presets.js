const { textWithQuickReply, postbackAction } = require('./builder');

function helpModePreset(text = 'ต้องการให้ผมช่วยแบบไหนครับ') {
  const items = [
    postbackAction('ถามตอบด้วย AI', 'mode=ai', 'ถามตอบด้วย AI'),
    postbackAction('ติดต่อเจ้าหน้าที่', 'mode=human', 'ติดต่อเจ้าหน้าที่'),
  ];
  return textWithQuickReply(text, items);
}

module.exports = { helpModePreset };
