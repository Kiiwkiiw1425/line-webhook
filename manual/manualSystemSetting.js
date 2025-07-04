// manualSystemSetting.js
const createSubmenu = require('../utils/createSubmenu');

const systemSettingManual = createSubmenu('⚙ ตั้งค่าระบบและนโยบาย', [
  { label: '📅 ตั้งค่าปีงบประมาณ', uri: 'https://example.com/manuals/fiscal-year-setting.pdf' },
  { label: '🎛 ตั้งค่าการแสดงผล', uri: 'https://example.com/manuals/ui-config.pdf' },
  { label: '📂 ตั้งค่าเมนูด้านข้าง', uri: 'https://example.com/manuals/sidebar-setting.pdf' },
  { label: '🖥 ตรวจสอบระบบ', uri: 'https://example.com/manuals/server-check-update.pdf' },
  { label: '📜 ปรับปรุงนโยบาย', uri: 'https://example.com/manuals/policy-update.pdf' },
  { label: '🧹 ลบไฟล์ Back Up', uri: 'https://example.com/manuals/clean-backup.pdf' },
  { label: '⚙ ตั้งค่าตัวแปรระบบ', uri: 'https://example.com/manuals/system-config.pdf' }
]);

module.exports = systemSettingManual;
