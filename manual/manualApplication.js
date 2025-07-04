// manual/manualApplication.js

module.exports = {
  type: 'flex',
  altText: 'เมนู "แอปพลิเคชันมือถือ"',
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
          text: '📱 ดาวน์โหลด Mobile App',
          weight: 'bold',
          size: 'xl',
          color: '#1F2E55',
          align: 'center'
        },
        {
          type: 'button',
          style: 'primary',
          action: {
            type: 'uri',
            label: '📲 โหลดบน iOS (App Store)',
            uri: 'https://apps.apple.com/th/app/ocsc-hrms/id1523628790?mt=8'
          }
        },
        {
          type: 'button',
          style: 'secondary',
          action: {
            type: 'uri',
            label: '📲 โหลดบน Android (Play Store)',
            uri: 'https://play.google.com/store/apps/details?id=com.hrms.go.th&hl=th'
          }
        }
      ]
    }
  }
};
