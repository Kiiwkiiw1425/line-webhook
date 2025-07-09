const createSubmenu = require('../utils/createSubmenu');
const evaluationManual = createSubmenu('✅ การประเมินผล', [
  {label: '⚙ ตั้งค่าสมรรถนะ', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/ERmwfnBRwGxHoSLBhYim-0gBl8AAsB7eACR2Y8aELEByzw?e=hpL7qR'},
  {label: '🧭 กำหนดประเด็นตัวชี้วัด', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/Ebh0Fnw9nDRAsyj4ILFHEM8BfMUhIb0GemXOyAEC0A812w?e=Yy33x3'},
  {label: '📌 กำหนดตัวชี้วัด', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EfVu1CznQhdLnWSkm9YBpegB6Dnrfj2wGnkOjO06oVzvVA?e=aEfbT7'},
  {label: '🔄 เปิดรอบการประเมิน', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/Ed0WBHZiEPxHktj749BGE5oBkS-v9Kc4-NI-47CUSAcdDQ?e=FYW0CI'},
  {label: '🧑‍🏫 ประเมิน (ผู้ประเมิน)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EUM0VcIQx0hOtEM7QinSNL0BvEt4R_2fiYJoOHDIwCG_8Q?e=n6URdV'},
  {label: '🧑‍🎓 ประเมิน (ผู้รับประเมิน)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EZetFwpZpvJMvMYPjnpTbX0BtOEUgc_bNgzquPAv_TROpw?e=JL0Gbh'}
]);
module.exports = evaluationManual;
