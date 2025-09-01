// manualSystemSetting.js
const createSubmenu = require('../utils/createSubmenu');
const submanualLoginSettings = require('./submanual_LoginSettings'); // เรียกใช้ไฟล์ที่สร้างเมนูย่อย

const systemSettingManual = createSubmenu('⚙ ตั้งค่าระบบ/นโยบาย', [
  { label: '📅 ตั้งค่าปีงบประมาณ', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EeSoPNxLh2NMtFshuOcjc4sBVs7Ss-XEHTj-35vqOpseGA?e=DgvI05' },
  { label: '🎛 ตั้งค่าการแสดงผล', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EbfdRWo8ZAhLswTJaGVc3DAByLf3slS4Jo6jhfU3nb6ioA?e=qEV0E5' },
  { label: '📂 ตั้งค่าเมนูด้านข้าง', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EX3c2jyd86NNhZCZv1NkjrUBETX5q1TES_pykD262K650g?e=19QKV2' },
  { label: '🖥 ตรวจสอบระบบ', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EY3TZQuCwb1Lu_dTIyh7s30B8IQZT3N_FnkKn5tawOtn5g?e=muiY1M' },
  { label: '📜 ปรับปรุงนโยบาย', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/Ed4r5bp3Ap1Fr8LK8KGErOMBgVPlBaXUk_AQaHEErg6u_g?e=CjXos3' },
  { label: '🧹 ลบไฟล์ Back Up', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/Eb_nifk3pItFti6lPXZ_54kBhoeATNtBtt47_DSMURd1lA?e=FGrHG3' },
  { label: '⚙ ตั้งค่าตัวแปรระบบ', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/ES02TRgtHwVOuVN2B9oemDABsCSn3ZS2BVOyLBHK4lPwDQ?e=HvDcKU' },
  // แก้ไขส่วนนี้ให้กลับไปใช้ 'submenu' ตามรูปแบบที่กำหนดเอง
  { label: '🔐 กำหนดรูปแบบการเข้าสู่ระบบ', submenu: submanualLoginSettings }
]);

module.exports = systemSettingManual;
