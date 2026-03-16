const createSubmenu = require('../utils/createSubmenu');
const permissionManual = createSubmenu('🔐 สิทธิการใช้งาน', [
  {label: '👥 จัดการผู้ใช้งาน', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EY6U77UFfSZBlJHexNK6SbMBJXabnTtzxJwr7kIseJj4-g?e=2cox3w'},
  {label: '🛡 จัดการสิทธิ', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/Ed-VfKmWS0FPsHltft8My6wB9ZB-wq3ESUfeke7hkdifnw?e=aj48H9'},
  {label: '📚 จัดการข้อมูลพื้นฐาน', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EUhQJAnxIedFg_ZFeXDWm2gBW8l9f2Zu9VlKdXfTOrKGkw?e=XlHIyf'},
  {label: '📝 จัดการข้อมูลลงทะเบียน', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EbU3dIJmjaRAm9q9-zO3OpwB6xXV31OQkvbIvMX7Q3iUJw?e=j1LU14'},
  {label: '👁 ตั้งค่าสิทธิการมองเห็น', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EacaKpNjTh1NuNjF3rYSrv0BFYb8WoRnkZgtfU02eGljog?e=SWTS6q'},
  {label: '➕ เพิ่มกลุ่มผู้ใช้งาน', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EX_d1XF7IHRLiCqt3nF8x1sBI0wPNnxHWxLtoPCYIr9-Iw?e=mjXQz1'}
]);
module.exports = permissionManual;
