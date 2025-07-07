const fs = require('fs');
const path = require('path');

const categoryMenus = {};
const manualDir = __dirname;

// Mapping จากชื่อไฟล์ (ตัด 'manual' และ '.js') → ชื่อหมวดภาษาไทย
const fileNameToThaiName = {
  UsageGeneral: 'การใช้งานระบบทั่วไป',
  SystemSetting: 'ตั้งค่าระบบและนโยบาย',
  Personnel: 'ข้อมูลบุคลากร',
  Permission: 'สิทธิการใช้งาน',
  Leave: 'การลา',
  Structure: 'โครงสร้าง/ตำแหน่ง',
  Command: 'คำสั่ง',
  Report: 'รายงาน',
  Evaluation: 'การประเมินผล',
  ImportExport: 'นำเข้า/ส่งออกข้อมูล',
  Budget: 'บริหารวงเงิน',
  Other: 'อื่นๆ',
  Application: 'แอปพลิเคชัน',
  d6-Help: 'ช่วยเหลือ',
  d6-Update: 'การอัปเดตระบบ'
};

fs.readdirSync(manualDir).forEach(file => {
  if (file !== 'index.js' && file.endsWith('.js')) {
    const manual = require(path.join(manualDir, file));

    // ตัด prefix และนามสกุลไฟล์ → manualUsageGeneral.js → UsageGeneral
    const baseName = file
      .replace(/^manual/, '') // ลบ manual หน้าไฟล์
      .replace(/\.js$/, '');  // ลบ .js

    const thaiName = fileNameToThaiName[baseName];

    if (thaiName) {
      categoryMenus[thaiName] = manual;
    } else {
      console.warn(`⚠️ ไม่พบ mapping สำหรับไฟล์ ${file} (${baseName})`);
    }
  }
});

module.exports = categoryMenus;
