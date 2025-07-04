const createSubmenu = require('../utils/createSubmenu');
const permissionManual = createSubmenu('🔐 สิทธิการใช้งาน', [
  {label: '👥 จัดการผู้ใช้งาน', uri: 'https://example.com/manuals/user-management.pdf'},
  {label: '🛡 จัดการสิทธิ', uri: 'https://example.com/manuals/permissions.pdf'},
  {label: '📚 จัดการข้อมูลพื้นฐาน', uri: 'https://example.com/manuals/basic-info.pdf'},
  {label: '📝 ลงทะเบียนผู้ใช้งาน', uri: 'https://example.com/manuals/user-register.pdf'},
  {label: '👁 ตั้งค่าสิทธิการมองเห็น', uri: 'https://example.com/manuals/view-permission.pdf'},
  {label: '➕ เพิ่มกลุ่มผู้ใช้งาน', uri: 'https://example.com/manuals/user-group.pdf'},
  {label: '✍ ตั้งค่าผู้ลงนาม', uri: 'https://example.com/manuals/authorizer.pdf'}
]);
module.exports = permissionManual;
