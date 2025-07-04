const createSubmenu = require('../utils/createSubmenu');
const evaluationManual = createSubmenu('✅ การประเมินผล', [
  {label: '⚙ ตั้งค่าสมรรถนะ', uri: 'https://example.com/manuals/competency-setting.pdf'},
  {label: '🧭 กำหนดประเด็นตัวชี้วัด', uri: 'https://example.com/manuals/kpi-topic.pdf'},
  {label: '📌 กำหนดตัวชี้วัด', uri: 'https://example.com/manuals/kpi-define.pdf'},
  {label: '🔄 เปิดรอบการประเมิน', uri: 'https://example.com/manuals/eval-round.pdf'},
  {label: '🧑‍🏫 ประเมิน (ผู้ประเมิน)', uri: 'https://example.com/manuals/eval-by-evaluator.pdf'},
  {label: '🧑‍🎓 ประเมิน (ผู้รับประเมิน)', uri: 'https://example.com/manuals/eval-by-ee.pdf'}
]);
module.exports = evaluationManual;
