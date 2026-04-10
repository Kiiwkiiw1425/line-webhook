// manual/manualUsageGeneral.js

const createSubmenu = require('../utils/createSubmenu');

const usageGeneralManual = createSubmenu('🔧 การใช้งานระบบทั่วไป', [
  {
    label: '📌 ลงทะเบียนใช้งาน DPIS6',
    uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EX0QNbK-xCtAuVgtZRokJwBdhmaMoSkGPz9KV8gPe328Q?e=GfxFts&web=1'
  },
  {
    label: '📌 Login ด้วยเลขบัตรฯ / Email',
    uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/E0DBvgXTdeiKwdbra-TcwBbU27Opbthiq8xgYjUaIQ?e=9iCJiR'
  },
  {
    label: '📌 Login ด้วย Username & Password',
    uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/Ey09x500YOLZjNFFGdlSkoBLZn5QQTHYGnRrMsoYYHJfAQ?e=16uXJL'
  },
  {
    label: '📌 Login ด้วย LDAP',
    uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EVbciMcdPlNVE417RH5B6SiAJVUC-QGsTpcF0HgEYfryIM?e=15bEon'
  },
  {
    label: '📌 Login ด้วย ThaiID',
    uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EZXlOxZwI8ORKTK39ggDfBaBPCCPUMJH9BjcImCwppw2e-NNYdg&web=1'
  },
  {
    label: '🔑 เปลี่ยนรหัสผ่าน',
    uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EExnYF3d9GQgxtF2cRZ5SlB8nHlaDuaX6hcrhTxaSsqQ?e=KMhndav&web=1'
  },
  {
    label: '🔑 เปลี่ยนรหัสผ่าน (จำรหัสได้)',
    uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EeqrK3yQLC-VJQdaowAEC01PoBdXnKfrxpAbBg10iJpn_KIA?e=8CSp8w&web=1'
  },
  {
    label: '🔑 เปลี่ยนรหัสผ่าน (ลืมรหัส)',
    uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EoxryE3GF9gqxp2cFRZ5l8BnhHaDUax6hcrhTxaSsqQ?e=ZbnZ56&web=1'
  },
  {
    label: '📧 จำรหัสผ่านและอีเมลไม่ได้',
    uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EkepKag3HFIKU21004o-PEgB7LSEx6kWNRACPhQAmAOp-A?e=GmSS1l'
  },
  {
    label: '📵 ไม่ได้ OTP / ปิดหน้าต่าง',
    uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EejomzCLzIrDYCHWPvOb1Zsfqm16nJdH7QitRP8acRaAp?e=RHOXbN&web=1'
  },
  {
    label: '👤 จัดการโปรไฟล์',
    uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EZuzAvmXY_2CHEDS3OTuBo81JQ31Uffv1azZxrNG3-VFg?e=NHLpo8&web=1'
  },
  {
    label: '🎭 เปลี่ยนบทบาท',
    uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EtQRjBmvEaPXTr0QhwmORO_AVC49x6DRTatXeyjQ8ITAz?e=4pQm8w&web=1'
  },
  {
    label: '⚙️ ตั้งค่าปฏิทินวันหยุด',
    uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EIQ_3RqKALZQRQusLw4bjCjxjAOhw45V0M1M_d04-iWpsFY?e=NKWCAe&web=1'
  },
  {
    label: '📂 จัดการข้อมูลพื้นฐาน',
    uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EIQ_3RqKALZQRQusLw4bjCjxjAOhw45V0M1M_d04-iWpsFY?e=NKWCAe&web=1'
  }
]);

module.exports = usageGeneralManual;
