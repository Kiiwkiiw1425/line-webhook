// manualSystemSetting.js
const createSubmenu = require('../utils/createSubmenu');

const systemSettingManual = createSubmenu('⚙ ตั้งค่าระบบและนโยบาย', [
  {label: '📅 ตั้งค่าปีงบประมาณ (ผู้ดูแลระบบ)',uri: 'https://example.com/manuals/fiscal-year-setting.pdf'},
  {label: '🎛 ตั้งค่าการแสดงผลของโปรแกรม',uri: 'https://example.com/manuals/ui-config.pdf'},
  {label: '📂 ตั้งค่าเมนูด้านข้าง (Sidebar)',uri: 'https://example.com/manuals/sidebar-setting.pdf'},
  {label: '🖥 ตรวจสอบเครื่องแม่ข่าย & อัปเดต',uri: 'https://example.com/manuals/server-check-update.pdf'},
  {label: '📜 ปรับปรุงนโยบายการใช้งาน',uri: 'https://example.com/manuals/policy-update.pdf'},
  {label: '🧹 ลบไฟล์ Back Up ป้องกันไดรฟ์เต็ม',uri: 'https://example.com/manuals/clean-backup.pdf'},
  {label: '⚙ ตั้งค่าตัวแปรระบบ (System Config)',uri: 'https://example.com/manuals/system-config.pdf'}
]);

module.exports = systemSettingManual;
