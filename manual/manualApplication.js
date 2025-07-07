module.exports = {
  type: 'flex',
  altText: '📱 ดาวน์โหลด Mobile App',
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
          text: '📱 ดาวน์โหลด Mobile App',
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
            label: '📲 โหลดบน iOS (App Store)',
            uri: 'https://apps.apple.com/th/app/ocsc-hrms/id1523628790?mt=8'
          }
        },
        {
          type: 'button',
          style: 'primary',
          color: '#558B2F', // เขียวเข้มสำหรับปุ่ม
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
