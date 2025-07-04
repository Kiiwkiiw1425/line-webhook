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
            uri: 'https://yourdomain.com/daily-updates'
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
