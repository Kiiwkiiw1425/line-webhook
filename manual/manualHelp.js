module.exports = {
  type: 'flex',
  altText: 'เมนู "คำถาม/ช่วยเหลือ"',
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
          text: '🆘 เมนูคำถาม/ช่วยเหลือ',
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
            label: '📄 คำถามที่พบบ่อย',
            uri: 'https://sites.google.com/view/manual-dpis6/%E0%B8%84%E0%B8%B3%E0%B8%96%E0%B8%B2%E0%B8%A1%E0%B8%97%E0%B8%9E%E0%B8%9A%E0%B8%9A%E0%B8%AD%E0%B8%A2-faq?authuser=0'
          }
        },
        {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#F0A04B',
          cornerRadius: 'md',
          paddingAll: '12px',
          justifyContent: 'center',
          alignItems: 'center',
          action: {
            type: 'message',
            label: '💬 ติดต่อเจ้าหน้าที่',
            text: 'ติดต่อเจ้าหน้าที่'
          },
          contents: [
            {
              type: 'text',
              text: '💬 ติดต่อเจ้าหน้าที่',
              color: '#FFFFFF',
              size: 'md'
            }
          ]
        }
      ]
    }
  }
};
