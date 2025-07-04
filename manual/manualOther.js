const createSubmenu = require('../utils/createSubmenu');
const otherManual = createSubmenu('📖 อื่นๆ', [
  {label: '📱 ติดตั้ง & ใช้งานแอปมือถือ', uri: 'https://example.com/manuals/mobile-install.pdf'},
  {label: '🖼 ปรับขนาดภาพ (Paint 3D)', uri: 'https://example.com/manuals/resize-image.pdf'},
  {label: '💬 วิธีใช้งาน LINE OA', uri: 'https://example.com/manuals/line-oa-guide.pdf'},
  {label: '🔐 ตั้งค่าเข้าสู่ระบบด้วย ThaiD', uri: 'https://example.com/manuals/thaid-setting.pdf'}
]);
module.exports = otherManual;
