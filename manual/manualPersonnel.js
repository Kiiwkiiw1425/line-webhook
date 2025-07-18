const createSubmenu = require('../utils/createSubmenu');
const personnelManual = createSubmenu('👥 ข้อมูลบุคลากร', [
  {label: '➕ เพิ่มบุคลากร(คนใหม่)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EQGwX392uNJPsaqlWrgNNqUBIN0dFgm3AdVITeXpWsyJyg?e=RBI5Tc'},
  {label: '📥 เพิ่มบุคลากร(รับโอน)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EYuHNAqV2klLulI1e5BIbRIBIkLnISe9vnaWFJDxGZOs3A?e=96J9XL'},
  {label: '🎓 เพิ่มประวัติ(การศึกษา)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/ESaUi6atG3lMtHvQN5Csev0BVyjY8z-jbJkA9KzVUyA_Rg?e=hH23bQ'},
  {label: '🏛 เพิ่มประวัติ(ตำแหน่ง)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EX2D8w6Vjx1IuBtlGBj3R7QBJZz4rg0SAzUMh3icmkg73g?e=VuALNL'},
  {label: '💵 เพิ่มประวัติ(เงินเดือน/เงินประจำตำแหน่ง)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EWXuOnrgiM1JjG82SpGuVawBLEjDo_M8mQoD1kpdEu6LLg?e=ikZR5F'},
  {label: '💵 เพิ่มประวัติ(การรับเงินเพิ่มพิเศษ)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/Ebty3jHCZLxGg8uagYGa7mwBFla-UHk4fTN3hzFto2luRw?e=EnumJw'},
  {label: '👤 เพิ่มประวัติ(เปลี่ยนชื่อ-สกุล)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EYoO3oaBk0VIjSQzkExx5hUBryoDio4xtUyoFdhHn9rAIw?e=WLMpao'},
  {label: '🔎 ตรวจสอบคำขอเปลี่ยนแปลง', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EYViFTsEvnVCk_yY54Wu5VEBZsDlGleC5J7d-yhLPMkTng?e=J7d7GK'},
  {label: '👤 การนำเข้ารูปภาพโปรไฟล์', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EboIZHfVNr9OhXw56B9fL9gBudiGWCi-nBkeMEpllPBsrg?e=AJSjDF'},
  {label: '🔍 ตรวจสอบข้อมูล', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/ERpvaauo1QBHiedpCEn8xOcBRyp84D2nmY-yOe3SEbDfJg?e=mpwhl0'}
]);
module.exports = personnelManual;
