module.exports = {
  type: 'flex',
  altText: 'เมนู "การอัปเดตระบบ"',
  contents: {
    type: 'bubble',
    size: 'mega',
    body: {
      type: 'box',
      layout: 'vertical',
      spacing: 'lg',
      paddingAll: '20px',
      backgroundColor: '#F9FBE7', // พื้นหลังสีเขียวอ่อน
      contents: [
        {
          type: 'text',
          text: '🛠 การอัปเดตระบบ',
          weight: 'bold',
          size: 'xl',
          color: '#1B5E20', // เขียวเข้ม
          align: 'center'
        },
        {
          type: 'button',
          style: 'primary',
          color: '#558B2F', // เขียวเข้มสำหรับปุ่ม
          action: {
            type: 'uri',
            label: '📅 อัปเดตประจำวัน',
            uri: 'https://sites.google.com/view/manual-dpis6/%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A-dpis6'
          }
        },
        {
          type: 'button',
          style: 'primary',
          color: '#558B2F', // เขียวเข้มสำหรับปุ่ม
          action: {
            type: 'uri',
            label: '📡 สถานะใช้งาน DPIS6',
            uri: 'https://sites.google.com/view/manual-dpis6/%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A-dpis6'
          }
        }
      ]
    }
  }
};
