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
          color: '#F44336',
          action: {
            type: 'uri',
            label: '📄 คำถามที่พบบ่อย',
            uri: 'https://yourdomain.com/faq'
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
