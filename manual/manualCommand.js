const createSubmenu = require('../utils/createSubmenu');
const commandManual = createSubmenu('📄 บัญชีแนบท้าย/คำสั่ง', [
  {label: '📥 บรรจุ/แต่งตั้ง/รับโอน)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/Ece90tBH6XZBheUQuKRKv7gBu-1mqL9VnrXgMAceGoiAqQ?e=cPm4lX'},
  {label: '⬆ เลื่อนระดับ', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EZlzRhhGeydAo9arIXWo0-IBWgw5O2ypYIwQCod1qzN6SA?e=3Xdv5F'},
  {label: '🚪 ให้โอน/พ้นจากราชการ', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EWFIwsokAWZBpvPmMLQHHW4Bd37JAFgp6NPD5Fs31wqIYQ?e=LGj3TD'},
  {label: '📝 เกษียณอายุราชการ', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EZ2GacnLqeVOtKNd0jqsIiQBlzj_U7ahtNW_zpOkB1rxkw?e=iuKw9y'},
  {label: '🔄 ย้าย', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EUZkHqVQUwlIiWJukIpXhS0BxjhxfFqMTKsPZxj1lZdbVQ?e=C43qek'},
  {label: '🔄 ช่วยราชการ', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/ER8Nc5LWpClAkVUXvW2drCQBJ9r3YSP7Qta3YGp2jNQQYg?e=sTu56B'},
  {label: '⚖ รักษาการแทน', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/Eeg9dRrUqAxMr9me8X_X2LkB8n1M0NHA24nxFmqMCJ2B2w?e=iJMh6Z'},
  {label: '⚖ มอบหมายงาน', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EQ1NK04ZG0hLsswPIz7gThEBvBih1r7NkUQerQasWhHCtA?e=mRjWPe'},
  {label: '💵 คำสั่งเงินเดือน ว9/2567', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EUpCeWNf6IRFsUiPKhnJm7kBGRax8FJF1I7t-aXxyjAhwg?e=m8KSaZ'},
  {label: '📝 ยกเลิก/แก้ไขคำสั่ง', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EXpwo3HG1YBOshHmDi0VZOoBa58I3CeiOo4_pZbhYcoTCg?e=mEghxZ'},
  {label: '📝 การบรรจุข้าราชการ', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EXOayl9HHalEte5rd_-RY0kBB4tMn9JXImfngsf-vVmpHw?e=V1lxwl'}
]);
module.exports = commandManual;
