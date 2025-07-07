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
        backgroundColor: '#FFFFFF',
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
              height: 'sm', // ปรับความสูง
              color: '#f7f7f7', // สีเทาอ่อน
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
