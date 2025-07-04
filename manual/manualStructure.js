const createSubmenu = require('../utils/createSubmenu');
const structureManual = createSubmenu('🏢 โครงสร้าง/ตำแหน่ง', [
  {label: '🏛 โครงสร้างส่วนราชการ', uri: 'https://example.com/manuals/org-structure.pdf'},
  {label: '🧾 จัดการ Template ตำแหน่ง', uri: 'https://example.com/manuals/position-template.pdf'},
  {label: '📋 ขออนุมัติตำแหน่ง', uri: 'https://example.com/manuals/request-position.pdf'},
  {label: '✏ ปรับปรุงตำแหน่ง', uri: 'https://example.com/manuals/edit-position.pdf'}
]);
module.exports = structureManual;
