// manualUsageGeneral.js
const createSubmenu = require('../utils/createSubmenu');

const usageGeneralManual = createSubmenu('🔧 การใช้งานระบบทั่วไป', [
  { label: '📌 ลงทะเบียนใช้งาน DPIS6', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EX0QNBk-xCtAuJvgtZROkjwBdhmaMo5kGPz9KVggPe328Q?e=fGxFt5&web=1' },
  { label: '📌 Login ด้วยเลขบัตรฯ/Email', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EUObvqxT8e1KkWabra-TcwoBBu27oDpbthWq8xgUju1ALQ?e=QiCdJR' },  
  { label: '📌 Login ด้วยUsername&Password', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EYQ9x50UYOZLjtWWfgOlSkoBLZn5Q9THGYnrRMa0YYHJfA?e=I6wXLJ' },
  { label: '📌 Login ด้วย LDAP', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EbcxijMcdP1NvE4l71rH8vsB65iAJvUQC-OgsTpCff0QHg?e=yfrY1M' },
  { label: '📌 Loginด้วย ThaiID', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EXKIoZaWgORGkTK399gJfbABpCCPUN9huH98jctImCwppw?e=NVydq9&web=1' },
  { label: '🔑 เปลี่ยนรหัสผ่าน', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EcOznyF3GF9Gqpt2cFRZS5IB8nHIaDuaX6hcrbeTaX9ssQ?e=K1Mhnd&web=1' },
  { label: '🔑 เปลี่ยนรหัสผ่าน (จำรหัสได้)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EerK3yQLC-VJqOaw8ECO1PoBdXNkfrxpAbBglOijpn_KlA?e=8c9npa&download=1&web=1' },
  { label: '🔑 เปลี่ยนรหัสผ่าน (ลืมรหัส)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EerK3yQLC-VJqOaw8ECO1PoBdXNkfrxpAbBglOijpn_KlA?e=aELSQ5&web=1' },
  { label: '📧 จำรหัสผ่านและอีเมลไม่ได้', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EcOznyF3GF9Gqpt2cFRZS5IB8nHIaDuaX6hcrbeTaX9ssQ?e=ZbN7S6&web=1' },
  { label: '📵 ไม่ได้ OTP/ปิดหน้าต่าง', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/Eekfaq8zHF1Ku21OO4o-PEgB07LsEX6kwRwcAhtOdAQm-A?e=GmssiL&web=1' },
  { label: '👤 จัดการโปรไฟล์', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/Eej0MVzCLWxIpJCWbVHPYtoBi2sfaMpl6nYUdHZOiptRoA?e=aBOQXh&web=1' },
  { label: '🎭 เปลี่ยนบทบาท', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EZzuAvmxY_ZChEDS3QTuBo0B1IQ31UFkW2sz7xnG33-Vfg?e=NHUCop&web=1' }
]);
module.exports = usageGeneralManual;
