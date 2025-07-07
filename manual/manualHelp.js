module.exports = {
  type: 'flex',
  altText: 'เมนู "ช่วยเหลือ"',
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
          text: '🆘 เมนูช่วยเหลือ',
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
            label: '📄 คำถามที่พบบ่อย',
            uri: 'https://sites.google.com/view/manual-dpis6/%E0%B8%84%E0%B8%B3%E0%B8%96%E0%B8%B2%E0%B8%A1%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%9A%E0%B8%9A%E0%B9%88%E0%B8%AD%E0%B8%A2-faq'
          }
        },
        {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#558B2F',
          cornerRadius: 'md',
          paddingAll: '12px',
          justifyContent: 'center',
          alignItems: 'center',
          action: {
            type: 'message',
            label: '💬 ติดต่อแอดมิน',
            text: 'แอดมิน'
          },
          contents: [
            {
              type: 'text',
              text: '💬 ติดต่อแอดมิน',
              color: '#FFFFFF',
              size: 'md'
            }
          ]
        }
      ]
    }
  }
};
