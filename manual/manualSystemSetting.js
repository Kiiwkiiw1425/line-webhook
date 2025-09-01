// manualSystemSetting.js
const createSubmenu = require('../utils/createSubmenu');

const systemSettingManual = createSubmenu('⚙ ตั้งค่าระบบและนโยบาย', [
  { label: '📅 ตั้งค่าปีงบประมาณ', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EeSoPNxLh2NMtFshuOcjc4sBVs7Ss-XEHTj-35vqOpseGA?e=DgvI05' },
  { label: '🎛 ตั้งค่าการแสดงผล', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EbfdRWo8ZAhLswTJaGVc3DAByLf3slS4Jo6jhfU3nb6ioA?e=qEV0E5' },
  { label: '📂 ตั้งค่าเมนูด้านข้าง', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EX3c2jyd86NNhZCZv1NkjrUBETX5q1TES_pykD262K650g?e=19QKV2' },
  { label: '🖥 ตรวจสอบระบบ', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EY3TZQuCwb1Lu_dTIyh7s30B8IQZT3N_FnkKn5tawOtn5g?e=muiY1M' },
  { label: '📜 ปรับปรุงนโยบาย', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/Ed4r5bp3Ap1Fr8LK8KGErOMBgVPlBaXUk_AQaHEErg6u_g?e=CjXos3' },
  { label: '🧹 ลบไฟล์ Back Up', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/Eb_nifk3pItFti6lPXZ_54kBhoeATNtBtt47_DSMURd1lA?e=FGrHG3' },
  { label: '⚙ ตั้งค่าตัวแปรระบบ', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/ES02TRgtHwVOuVN2B9oemDABsCSn3ZS2BVOyLBHK4lPwDQ?e=HvDcKU' },
  { label: '🔐 ตั้งค่า(Email/ID Card)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/ETwgTtbDg4RPrFi17YEDaNMB-yv0px0wBfYaa20WixK0lg?e=mvHDgk' },
  { label: '🔐 ตั้งค่า(LDAP)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/Eade9U6fhGlJpMkLyu1ssqIBwG38O0vBGkQ4UVhKJHzFFw?e=l0yOcG' },
  { label: '🔐 ตั้งค่า(Smart Card)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/Edp_saUvNqBHpjpXr1HK0SoBHipNY3IZ6u5JgYV2aSNIDw?e=donLby' },
  { label: '🔐 ตั้งค่า(Username และ Password)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EQroPfCb7LJNtRw7Y-f3EZoBzFAI72Lnfuaob5TkyEaiMw?e=IF3gzT' },
  { label: '🔐 ตั้งค่า(ThaID)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EY_ntN9-15JMhnjhMFNeTR0B4aiaEz4t3ruhXXfAHEHOUA?e=RGTEhe'}
]);
module.exports = systemSettingManual;
