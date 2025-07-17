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
      backgroundColor: '#FFFFFF', // พื้นหลังสีขาว
      contents: [
        {
          type: 'text',
          text: '🛠 การอัปเดตระบบ',
          weight: 'bold',
          size: 'xl',
          color: '#1F2E55', // เขียวเข้ม
          align: 'center'
        },
        {
          type: 'button',
          style: 'primary',
          color: '#F0A04B', // เขียวเข้มสำหรับปุ่ม
          action: {
            type: 'uri',
            label: '📅 อัปเดตประจำวัน',
            uri: 'https://sites.google.com/view/manual-dpis6/%E0%B8%AD%E0%B8%9B%E0%B9%80%E0%B8%94%E0%B8%95%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A-dpis?authuser=0'
          }
        },
        {
          type: 'button',
          style: 'primary',
          color: '#F0A04B', // เขียวเข้มสำหรับปุ่ม
          action: {
            type: 'uri',
            label: '📡 สถานะใช้งาน DPIS6',
            uri: 'https://sites.google.com/view/manual-dpis6/%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A-dpis6?authuser=0'
          }
        }
      ]
    }
  }
};
