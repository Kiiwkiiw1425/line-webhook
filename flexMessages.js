// flexMessages.js (ฉบับ Final)

// ⬇️⬇️⬇️ ส่วนที่เปลี่ยนแปลง ⬇️⬇️⬇️
// (ลบ const ... = require('./manual/...') ทั้ง 13+ บรรทัดออกทั้งหมด)
// ⬆️⬆️⬆️ จบส่วนเปลี่ยนแปลง ⬆️⬆️⬆️


// mainMenu (ที่แก้ไขเป็น postback แล้ว)
const mainMenu = {
  type: 'flex',
  altText: '📚 เมนูเลือกหมวดหมู่คู่มือ',
  contents: {
    type: 'carousel',
    contents: [
      // Bubble 1
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
                { type: 'button', style: 'secondary', action: { type: 'postback', label: '🖥 การใช้งานระบบทั่วไป', data: 'action=show_menu&category=การใช้งานระบบทั่วไป', displayText: '🖥 การใช้งานระบบทั่วไป' } },
                { type: 'button', style: 'secondary', action: { type: 'postback', label: '⚙ ตั้งค่าระบบ/นโยบาย', data: 'action=show_menu&category=ตั้งค่าระบบ/นโยบาย', displayText: '⚙ ตั้งค่าระบบ/นโยบาย' } },
                { type: 'button', style: 'secondary', action: { type: 'postback', label: '👤 ข้อมูลบุคลากร', data: 'action=show_menu&category=ข้อมูลบุคลากร', displayText: '👤 ข้อมูลบุคลากร' } },
                { type: 'button', style: 'secondary', action: { type: 'postback', label: '🔐 สิทธิการใช้งาน', data: 'action=show_menu&category=สิทธิการใช้งาน', displayText: '🔐 สิทธิการใช้งาน' } }
              ]
            }
          ]
        }
      },
      // Bubble 2
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
                { type: 'button', style: 'secondary', action: { type: 'postback', label: '📆 การลา', data: 'action=show_menu&category=การลา', displayText: '📆 การลา' } },
                { type: 'button', style: 'secondary', action: { type: 'postback', label: '🏢 โครงสร้าง/ตำแหน่ง', data: 'action=show_menu&category=โครงสร้าง/ตำแหน่ง', displayText: '🏢 โครงสร้าง/ตำแหน่ง' } },
                { type: 'button', style: 'secondary', action: { type: 'postback', label: '📄 คำสั่ง/บัญชีแนบท้าย', data: 'action=show_menu&category=คำสั่ง/บัญชีแนบท้าย', displayText: '📄 คำสั่ง/บัญชีแนบท้าย' } },
                { type: 'button', style: 'secondary', action: { type: 'postback', label: '📊 รายงาน', data: 'action=show_menu&category=รายงาน', displayText: '📊 รายงาน' } }
              ]
            }
          ]
        }
      },
      // Bubble 3
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
                { type: 'button', style: 'secondary', action: { type: 'postback', label: '✅ การประเมินผล', data: 'action=show_menu&category=การประเมินผล', displayText: '✅ การประเมินผล' } },
                { type: 'button', style: 'secondary', action: { type: 'postback', label: '📥 นำเข้า/ส่งออกข้อมูล', data: 'action=show_menu&category=นำเข้า/ส่งออกข้อมูล', displayText: '📥 นำเข้า/ส่งออกข้อมูล' } },
                { type: 'button', style: 'secondary', action: { type: 'postback', label: '💰 บริหารวงเงิน', data: 'action=show_menu&category=บริหารวงเงิน', displayText: '💰 บริหารวงเงิน' } },
                { type: 'button', style: 'secondary', action: { type: 'postback', label: '📖 อื่นๆ', data: 'action=show_menu&category=อื่นๆ', displayText: '📖 อื่นๆ' } }
              ]
            }
          ]
        }
      }
    ]
  }
};

// ⬇️⬇️⬇️ ส่วนที่เปลี่ยนแปลง ⬇️⬇️⬇️
// (ลบ const categoryMenus = { ... } ทั้งก้อนออก)

module.exports = {
  mainMenu 
 // (ลบ categoryMenus ออกจาก exports)
};
// ⬆️⬆️⬆️ จบส่วนเปลี่ยนแปลง ⬆️⬆️⬆️
