
const { textWithQuickReply, postbackAction } = require('./builder');

function modeSwitchItems() {
  return [
    postbackAction('🤖 ถามตอบด้วย AI', 'mode=ai'),
    postbackAction('👩‍💼 ติดต่อเจ้าหน้าที่', 'mode=human')
  ];
}

function withModeSwitch(text) {
  return textWithQuickReply(text, modeSwitchItems());
}

function backToAIPreset(text) {
  return textWithQuickReply(text, [
    postbackAction('🤖 กลับไปถาม AI', 'mode=ai')
  ]);
}

function helpModePreset(text) {
  return textWithQuickReply(text, modeSwitchItems());
}

module.exports = {
  withModeSwitch,
  backToAIPreset,
  helpModePreset
};
