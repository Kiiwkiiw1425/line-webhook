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
      backgroundColor: '#FFF8F6',
      contents: [
        {
          type: 'text',
          text: '🆘 เมนูช่วยเหลือ',
          weight: 'bold',
          size: 'xl',
          color: '#B71C1C',
          align: 'center'
        },
        {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#FF7043',
          cornerRadius: 'md',
          paddingAll: '12px',
          justifyContent: 'center',
          alignItems: 'center',
          action: {
            type: 'uri',
            label: '📄 คำถามที่พบบ่อย',
            uri: 'https://sites.google.com/view/manual-dpis6/%E0%B8%84%E0%B8%B3%E0%B8%96%E0%B8%B2%E0%B8%A1%E0%B8%97%E0%B8%9E%E0%B8%9A%E0%B8%9A%E0%B8%AD%E0%B8%A2-faq?authuser=0'
          },
          contents: [
            {
              type: 'text',
              text: '📄 คำถามที่พบบ่อย',
              align: 'center',
              weight: 'bold',
              color: '#FFFFFF',
              size: 'md',
              margin: 'md'
            }
          ],
          paddingAll: '12px'
        },
        {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#FF7043',
          cornerRadius: 'md',
          action: {
            type: 'message',
            label: '💬 ติดต่อแอดมิน',
            text: 'แอดมิน'
          },
          contents: [
            {
              type: 'text',
              text: '💬 ติดต่อแอดมิน',
              align: 'center',
              weight: 'bold',
              color: '#FFFFFF',
              size: 'md',
              margin: 'md'
            }
          ],
          paddingAll: '12px'
        }
      ]
    }
  }
};
