const createSubmenu = require('../utils/createSubmenu');
const reportManual = createSubmenu('📊 รายงาน', [
  {label: '📈 รายงานสถิติการรับ/สูญเสีย', uri: 'https://example.com/manuals/personnel-stat-report.pdf'},
  {label: '📋 รายงานแบบตาราง', uri: 'https://example.com/manuals/tabular-report.pdf'}
]);
module.exports = reportManual;
