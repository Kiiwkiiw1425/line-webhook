const fs = require('fs');
const path = require('path');

const categoryMenus = {};

const manualDir = __dirname;

fs.readdirSync(manualDir).forEach(file => {
  if (file !== 'index.js' && file.endsWith('.js')) {
    const manual = require(path.join(manualDir, file));
    // ใช้ชื่อไฟล์ (ตัดคำว่า manual และ .js ออก) เป็น key
    const name = manual.altText?.replace(/^เมนู\s*"?|"?$/g, '').trim();
    if (name) {
      categoryMenus[name] = manual;
    }
  }
});

module.exports = categoryMenus;
