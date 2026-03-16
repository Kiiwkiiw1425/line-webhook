const { askAI } = require('../services/aiService.gemini'); // หรือ openai
// ...
if (state.mode === 'ai') {
  const { answer, failed } = await askAI(userText);
  if (failed) {
    return reply(replyToken, helpModePreset('คำถามนี้อาจซับซ้อน ต้องการให้เจ้าหน้าที่ช่วยไหมครับ'));
  }
  return reply(replyToken, { type: 'text', text: answer.slice(0, 4800) });
}
