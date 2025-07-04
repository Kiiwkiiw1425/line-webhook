const createSubmenu = require('../utils/createSubmenu');
const leaveManual = createSubmenu('📆 การลา', [
  {label: '⚙ ตั้งค่าการลา', uri: 'https://example.com/manuals/leave-config.pdf'},
  {label: '📅 ตั้งค่าปฏิทินวันหยุด', uri: 'https://example.com/manuals/holiday-calendar.pdf'},
  {label: '🧑‍💼 การลา (ผู้อนุมัติ)', uri: 'https://example.com/manuals/leave-approver.pdf'},
  {label: '🧑‍📝 การลา (ผู้ยื่นลา)', uri: 'https://example.com/manuals/leave-applicant.pdf'},
  {label: '📱 ยื่นคำขอลา (Mobile)', uri: 'https://example.com/manuals/leave-mobile-submit.pdf'},
  {label: '✏ แก้ไขคำขอลา (Mobile)', uri: 'https://example.com/manuals/leave-mobile-edit.pdf'},
  {label: '⏱ ลงเวลา (Mobile)', uri: 'https://example.com/manuals/leave-mobile-time.pdf'},
  {label: '✅ อนุมัติลา (Mobile)', uri: 'https://example.com/manuals/leave-mobile-approve.pdf'},
  {label: '🗃 อนุมัติคำร้อง (Mobile)', uri: 'https://example.com/manuals/request-approve.pdf'},
  {label: '❌ ยกเลิกคำขอลา (Mobile)', uri: 'https://example.com/manuals/leave-cancel.pdf'}
]);
module.exports = leaveManual;
