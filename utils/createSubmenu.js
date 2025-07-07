function createSubmenu(title, items) {
  return {
    type: 'flex',
    altText: `เมนู "${title}"`,
    contents: {
      type: 'bubble',
      size: 'mega',
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        paddingAll: '20px',
        backgroundColor: '#F9FBE7', // เพิ่มพื้นหลังสบายตา
        contents: [
          {
            type: 'text',
            text: title,
            weight: 'bold',
            size: 'xl',
            color: '#1B5E20',
            align: 'center'
          },
          {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: items.map(item => ({
              type: 'button',
              style: 'secondary',
              height: 'sm', // ปรับให้สูงพอดี
              color: '#8BC34A', // สีเขียวอ่อน (หรือเปลี่ยนได้)
              margin: 'sm',
              action: {
                type: 'uri',
                label: item.label,
                uri: item.uri
              }
            }))
          }
        ]
      }
    }
  };
}

module.exports = createSubmenu;
