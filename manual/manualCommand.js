const createSubmenu = require('../utils/createSubmenu');
const commandManual = createSubmenu('📄 คำสั่ง', [
  {label: '📥 บัญชีแนบท้าย (บรรจุ/โอน)', uri: 'https://example.com/manuals/command-recruit-transfer.pdf'},
  {label: '⬆ เลื่อนระดับ', uri: 'https://example.com/manuals/promotion.pdf'},
  {label: '🚪 ออกจากราชการ', uri: 'https://example.com/manuals/retirement.pdf'},
  {label: '🔄 ย้าย/ช่วยราชการ', uri: 'https://example.com/manuals/transfer-secondment.pdf'},
  {label: '⚖ รักษาการ/มอบหมาย', uri: 'https://example.com/manuals/acting-duty.pdf'},
  {label: '💵 คำสั่งเงินเดือน ว9/2567', uri: 'https://example.com/manuals/salary-w9.pdf'},
  {label: '📝 ยกเลิก/แก้ไขคำสั่ง', uri: 'https://example.com/manuals/revoke-edit-command.pdf'}
]);
module.exports = commandManual;
