const createSubmenu = require('../utils/createSubmenu');
const budgetManual = createSubmenu('💰 บริหารวงเงิน', [
  {label: '📊 วงเงินเจ้าหน้าที่ & ผู้บริหาร', uri: 'https://example.com/manuals/budget-management.pdf'}
]);
module.exports = budgetManual;
