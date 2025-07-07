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
          type: 'button',
          style: 'primary',
          color: '#FF7043',
          action: {
            type: 'uri',
            label: '📄 คำถามที่พบบ่อย',
            uri: 'https://sites.google.com/view/manual-dpis6/%E0%B8%84%E0%B8%B3%E0%B8%96%E0%B8%B2%E0%B8%A1%E0%B8%97%E0%B8%9E%E0%B8%9A%E0%B8%9A%E0%B8%AD%E0%B8%A2-faq?authuser=0'
          }
        },
        {
          type: 'button',
          style: 'secondary',
          color: '#FF7043',
          action: {
            type: 'message',
            label: '💬 ติดต่อแอดมิน',
            text: 'แอดมิน'
          }
        }
      ]
    }
  }
};
