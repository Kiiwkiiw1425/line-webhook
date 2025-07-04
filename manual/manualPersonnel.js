const createSubmenu = require('../utils/createSubmenu');
const personnelManual = createSubmenu('👤 ข้อมูลบุคลากร', [
  {label: '➕ เพิ่มบุคลากร (คนใหม่)', uri: 'https://example.com/manuals/personnel-new.pdf'},
  {label: '📥 เพิ่มบุคลากร (รับโอน)', uri: 'https://example.com/manuals/personnel-transfer.pdf'},
  {label: '🎓 เพิ่มประวัติ (การศึกษา)', uri: 'https://example.com/manuals/education-history.pdf'},
  {label: '🏛 เพิ่มประวัติ (ตำแหน่ง)', uri: 'https://example.com/manuals/position-history.pdf'},
  {label: '💵 เพิ่มประวัติ (เงินเดือน)', uri: 'https://example.com/manuals/salary-history.pdf'},
  {label: '👤 เพิ่มประวัติ (เปลี่ยนชื่อ-สกุล)', uri: 'https://example.com/manuals/name-change.pdf'},
  {label: '🔎 ตรวจสอบคำขอเปลี่ยนแปลง', uri: 'https://example.com/manuals/profile-change-check.pdf'}
]);
module.exports = personnelManual;
