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
      contents: [
        {
          type: 'text',
          text: '🛠 การอัปเดตระบบ',
          weight: 'bold',
          size: 'xl',
          color: '#33691E',
          align: 'center'
        },
        {
          type: 'button',
          style: 'primary',
          color: '#689F38',
          action: {
            type: 'uri',
            label: '📅 อัปเดตประจำวัน',
            uri: 'https://sites.google.com/view/manual-dpis6/%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A-dpis6'
          }
        },
        {
          type: 'button',
          style: 'secondary',
          color: '#558B2F',
          action: {
            type: 'uri',
            label: '📡 สถานะใช้งาน DPIS6',
            uri: 'https://yourdomain.com/dpis-status'
          }
        }
      ]
    }
  }
};
