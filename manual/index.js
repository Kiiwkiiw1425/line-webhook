const fs = require('fs');
const path = require('path');

const categoryMenus = {};
const manualDir = __dirname;

// Mapping จากชื่อไฟล์ (ตัด 'manual' และ '.js') → ชื่อหมวดภาษาไทย
const fileNameToThaiName = {
  UsageGeneral: 'การใช้งานระบบทั่วไป',
  SystemSetting: 'ตั้งค่าระบบ/นโยบาย',
  Personnel: 'ข้อมูลบุคลากร',
  Permission: 'สิทธิการใช้งาน',
  Leave: 'การลา',
  Structure: 'โครงสร้าง/ตำแหน่ง',
  Command: 'คำสั่ง/บัญชีแนบท้าย',
  Report: 'รายงาน',
  Evaluation: 'การประเมินผล',
  ImportExport: 'นำเข้า/ส่งออกข้อมูล',
  Budget: 'บริหารวงเงิน',
  Other: 'อื่นๆ',
  Application: 'แอปพลิเคชัน',
  Help: 'คำถาม/ช่วยเหลือ',
  Update: 'อัปเดตระบบ/การใช้งาน'
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
