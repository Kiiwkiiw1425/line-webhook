const createSubmenu = require('../utils/createSubmenu');
const importExportManual = createSubmenu('📥 นำเข้า/ส่งออกข้อมูล', [
  {label: '💵 นำเข้าข้อมูลเลื่อนเงินเดือน', uri: 'https://example.com/manuals/import-salary.pdf'},
  {label: '📄 นำเข้าข้อมูลภาษี', uri: 'https://example.com/manuals/import-tax.pdf'},
  {label: '🧾 นำเข้าสลิปเงินเดือน', uri: 'https://example.com/manuals/import-slip.pdf'},
  {label: '📎 นำเข้าไฟล์แนบท้ายคำสั่ง', uri: 'https://example.com/manuals/import-command.pdf'}
]);
module.exports = importExportManual;
