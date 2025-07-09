const createSubmenu = require('../utils/createSubmenu');
const leaveManual = createSubmenu('📆 การลา', [
  {label: '⚙ ตั้งค่าการลา', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/ERi96W7PeOxBovDYg3XEjOMB0SIVBEQSJatoL9Khw-XGcQ?e=ZbGc7v'},
  {label: '📅 ตั้งค่าปฏิทินวันหยุด', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EQk2IKenec1Jq1yZ0_rtRPgBmg0d3RjXnyEApSW-RlXz3w?e=TApX13'},
  {label: '🧑‍💼 การลา (ผู้อนุมัติ)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EblDHxyIcSxNiYNsOGsEzucBH41uQ5mAruwU2Q6Zn-0IuA?e=ZAet40'},
  {label: '🧑‍📝 การลา (ผู้ยื่นลา)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EQqReg0wlgJDi4SV3Mn8ausB4yaGA2Hl_cNSuuLFFc-gaw?e=5ngRjm'},
  {label: '📱 ยื่นคำขอลา (Mobile)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/ERDkBxBpkhJEpEThiVKU7BMBJb-dpxzMWq3HpyIyYxs1ew?e=55fPOh'},
  {label: '✏ แก้ไขคำขอลา (Mobile)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EXMVhQKxpP1Pn54AOTUa1x4B9fMl70_SbV1sNAAP-EuBvA?e=rJ6x6Q'},
  {label: '⏱ ขอลงเวลา (Mobile)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EQmW2QkzcPJHopnN1Po_rjEBGssZvvNDb70w8zb75ZyWlg?e=c4ddcU'},
  {label: '✅ อนุมัติการลา (Mobile)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EdYxEq3lIXhJvCbjUa3nrBYB0jWkgE0cH-6w6EW-ZYt9TA?e=eCp1Vk'},
  {label: '🗃 อนุมัติคำร้อง (Mobile)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/ER2nFZsDatZDhyLMT1YUScIB5V6dzq_nCtTZzMJYa2aEbQ?e=3HQA8u'},
  {label: '❌ ยกเลิกคำขอลา (Mobile)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/ET7cRnqDBV1Ivwjl_xtuEMEB-aEyVEjl2WiY3DPqwR-1QA?e=JZBXTO'},
  {label: '📅 กําหนดผู้มีสิทธิอนุญาตลา', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EWbDCcOF-_1MswbUfuvamzIBmuSVygVkqZVUa-Ek22RsPQ?e=MAzaC3'}
]);
module.exports = leaveManual;
