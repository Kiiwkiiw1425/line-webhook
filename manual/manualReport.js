const createSubmenu = require('../utils/createSubmenu');
const reportManual = createSubmenu('📊 รายงาน', [
  {label: '📈 บรรจุ/รับโอน/สูญเสีย', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EbakEvTyRr9JvblgrPUCmwgBa68HSxscmO1UHFjTlVzWWg?e=EW4LwD'},
  {label: '📋 รายงานแบบตาราง', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EUpc7e6qSXREsXMs0TwNX94BJr4Q1UmQhW0wvS7S13y7gA?e=ldsKK4'}
]);
module.exports = reportManual;
