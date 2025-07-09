const createSubmenu = require('../utils/createSubmenu');
const importExportManual = createSubmenu('📥 นำเข้า/ส่งออกข้อมูล', [
  {label: '💵 นำเข้าข้อมูลเลื่อนเงินเดือน', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/ETdFlrSHQFNAsYfkx4KMDNIBRFcID_rJjll0KaNQU_k8BQ?e=kJVW1b'},
  {label: '📄 นำเข้าข้อมูลภาษี', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EY1qA0a3UJlGkgoxRYUhrXIBr5lp4axHy6m9xsY7gTS3dQ?e=VJUMie'},
  {label: '🧾 นำเข้าสลิปเงินเดือน', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EWj5opp9BuNCv_nPot3Hor4B4Jn-D8oeLnau0B17ue5tUg?e=59au8l'},
  {label: '📎 นำเข้าไฟล์แนบท้ายคำสั่ง', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EdAdnLJJ2lxFlBjy80oE47gBSVP-5lMBdbX94MKfM-6f9Q?e=IU9Z5y'}
]);
module.exports = importExportManual;
