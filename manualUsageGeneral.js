// 📁 manualUsageGeneral.js
const createSubmenu = require('./utils/createSubmenu');

const usageGeneralManual = createSubmenu('🔧 การใช้งานระบบทั่วไป', [
  { label: '📌 ลงทะเบียนใช้งาน DPIS6', uri: 'https://link1' },
  { label: '🔑 เปลี่ยนรหัสผ่าน (จำรหัสได้)', uri: 'https://link2' },
  { label: '🔀 เปลี่ยนรหัสผ่าน (ลืมรหัส)', uri: 'https://link3' },
  { label: '📵 ไม่ได้ OTP / ปิดหน้าต่าง', uri: 'https://link4' },
  { label: '📧 จำรหัสและอีเมลไม่ได้', uri: 'https://link5' },
  { label: '👤 จัดการโปรไฟล์', uri: 'https://link6' },
  { label: '🎭 เปลี่ยนบทบาท', uri: 'https://link7' },
  { label: '🇹🇭 เข้าด้วย ThaiID', uri: 'https://link8' }
]);

module.exports = usageGeneralManual;
