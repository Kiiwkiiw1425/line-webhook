// flexMessages.js

const mainMenu = {
  type: 'flex',
  altText: '📚 เมนูเลือกหมวดหมู่คู่มือ',
  contents: {
    type: 'carousel',
    contents: [
      {
        type: 'bubble',
        size: 'mega',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          paddingAll: '20px',
          contents: [
            {
              type: 'text',
              text: '📚 เลือกหมวดหมู่คู่มือ',
              weight: 'bold',
              size: 'xl',
              color: '#1F2E55'
            },
            {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              contents: [
                { type: 'button', style: 'secondary', action: { type: 'message', label: '🖥 การใช้งานระบบทั่วไป', text: 'การใช้งานระบบทั่วไป' } },
                { type: 'button', style: 'secondary', action: { type: 'message', label: '⚙ ตั้งค่าระบบและนโยบาย', text: 'ตั้งค่าระบบและนโยบาย' } },
                { type: 'button', style: 'secondary', action: { type: 'message', label: '👤 ข้อมูลบุคลากร', text: 'ข้อมูลบุคลากร' } },
                { type: 'button', style: 'secondary', action: { type: 'message', label: '🔐 สิทธิการใช้งาน', text: 'สิทธิการใช้งาน' } }
              ]
            }
          ]
        }
      },
      {
        type: 'bubble',
        size: 'mega',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          paddingAll: '20px',
          contents: [
            {
              type: 'text',
              text: '📚 หมวดหมู่เพิ่มเติม',
              weight: 'bold',
              size: 'xl',
              color: '#1F2E55'
            },
            {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              contents: [
                { type: 'button', style: 'secondary', action: { type: 'message', label: '📆 การลา', text: 'การลา' } },
                { type: 'button', style: 'secondary', action: { type: 'message', label: '🏢 โครงสร้าง/ตำแหน่ง', text: 'โครงสร้าง/ตำแหน่ง' } },
                { type: 'button', style: 'secondary', action: { type: 'message', label: '📄 คำสั่ง', text: 'คำสั่ง' } },
                { type: 'button', style: 'secondary', action: { type: 'message', label: '📊 รายงาน', text: 'รายงาน' } }
              ]
            }
          ]
        }
      },
      {
        type: 'bubble',
        size: 'mega',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          paddingAll: '20px',
          contents: [
            {
              type: 'text',
              text: '📚 หมวดหมู่เพิ่มเติม',
              weight: 'bold',
              size: 'xl',
              color: '#1F2E55'
            },
            {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              contents: [
                { type: 'button', style: 'secondary', action: { type: 'message', label: '✅ การประเมินผล', text: 'การประเมินผล' } },
                { type: 'button', style: 'secondary', action: { type: 'message', label: '📥 นำเข้า/ส่งออกข้อมูล', text: 'นำเข้า/ส่งออกข้อมูล' } },
                { type: 'button', style: 'secondary', action: { type: 'message', label: '💰 บริหารวงเงิน', text: 'บริหารวงเงิน' } },
                { type: 'button', style: 'secondary', action: { type: 'message', label: '📖 อื่นๆ', text: 'อื่นๆ' } }
              ]
            }
          ]
        }
      }
    ]
  }
};

const categoryMenus = {
  'การใช้งานระบบทั่วไป': createSubmenu('🔧 การใช้งานระบบทั่วไป', [
    { label: '📌 ลงทะเบียนใช้งาน DPIS6', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EX0QNBk-xCtAuJvgtZROkjwBdhmaMo5kGPz9KVggPe328Q?e=fGxFt5&web=1' },
    { label: '🔑 เปลี่ยนรหัสผ่าน (จำรหัสได้)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EerK3yQLC-VJqOaw8ECO1PoBdXNkfrxpAbBglOijpn_KlA?e=8c9npa&download=1&web=1' },
    { label: '🔀 เปลี่ยนรหัสผ่าน (ลืมรหัส)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EdDGHR_YxSNLnUh1xwFAGKkB2cKODsuPzLzBLAoAA8bj0A?e=rPG5ah' },
    { label: '📵 ไม่ได้ OTP / ปิดหน้าต่าง', uri: 'https://example.com/manuals/no-otp.pdf' },
    { label: '📧 จำรหัสและอีเมลไม่ได้', uri: 'https://example.com/manuals/email-issue.pdf' },
    { label: '👤 จัดการโปรไฟล์', uri: 'https://example.com/manuals/profile.pdf' },
    { label: '🎭 เปลี่ยนบทบาท', uri: 'https://example.com/manuals/role-switch.pdf' },
    { label: '🇹🇭 เข้าด้วย ThaiID', uri: 'https://example.com/manuals/thaid.pdf' }
  ]),

  // หมวดอื่นๆ เพิ่มตามโครงสร้างเดียวกัน (กำลังจะเขียนต่อให้)
};

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
        contents: [
          { type: 'text', text: title, weight: 'bold', size: 'xl', color: '#1F2E55' },
          {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: items.map(item => ({
              type: 'button',
              style: 'secondary',
              action: { type: 'uri', label: item.label, uri: item.uri }
            }))
          }
        ]
      }
    }
  };
}

module.exports = {
  mainMenu,
  categoryMenus
};
