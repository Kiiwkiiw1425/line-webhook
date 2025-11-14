/**
 * ฟังก์ชันสร้าง Flex Message Bubble สำหรับเมนูย่อย
 * @param {string} title - หัวข้อของเมนู (เช่น "✅ การประเมินผล")
 * @param {Array<{label: string, uri: string}>} actions - รายการปุ่มและลิงก์
 * @returns {object} Flex Message Object
 */
function createSubmenu(title, actions) {
    // แปลงรายการ actions ให้เป็น Button Components
    const buttonContents = actions.map(item => ({
        type: 'button',
        style: 'link', // ใช้สไตล์ link เพื่อให้ดูเหมือนเมนู
        height: 'sm',
        action: {
            type: 'uri',
            label: item.label,
            uri: item.uri
        }
    }));

    return {
        type: 'flex',
        altText: title,
        contents: {
            type: 'bubble',
            body: {
                type: 'box',
                layout: 'vertical',
                spacing: 'md',
                paddingAll: '20px',
                backgroundColor: '#F7F7F7', // พื้นหลังเทาอ่อน
                contents: [
                    {
                        type: 'text',
                        text: title,
                        weight: 'bold',
                        size: 'xl',
                        color: '#1F2E55',
                        align: 'center',
                        margin: 'none'
                    },
                    {
                        type: 'separator',
                        margin: 'lg',
                        color: '#DDDDDD'
                    },
                    {
                        type: 'box',
                        layout: 'vertical',
                        spacing: 'sm',
                        contents: buttonContents
                    }
                ]
            }
        }
    };
}

module.exports = createSubmenu;
