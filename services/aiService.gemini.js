async function askAI(question, hits) {
  const context = hits[0].content;

  const prompt = `
ตอบคำถามโดยใช้ข้อมูลด้านล่างเพียงรายการเดียวเท่านั้น
ห้ามเดา ห้ามเพิ่มข้อมูลนอกเหนือจากนี้

ข้อมูล:
${context}

คำถาม: ${question}
`;

  const answer = await callGemini(prompt);
  return { answer };
}

module.exports = { askAI };
