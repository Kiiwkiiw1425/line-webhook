// flexMessages.js

// ... (โค้ด mainMenu, levelSelectorMenu, beginnerMenu, beginnerContent ที่มีอยู่เดิม) ...

// ------------------------------------------------
// 1.5. userRoleSelector (L1 - New Intermediary Step)
// ------------------------------------------------
const userRoleSelector = {
  type: 'flex',
  altText: 'คุณเป็นผู้ใช้ใหม่หรือผู้ใช้เก่า?',
  contents: {
    type: 'bubble',
    size: 'kilo',
    header: {
      type: 'box',
      layout: 'vertical',
      backgroundColor: '#1F2E55',
      contents: [
        { type: 'text', text: '👋 โปรดเลือกประเภทผู้ใช้งาน', color: '#FFFFFF', size: 'lg', weight: 'bold' }
      ]
    },
    body: {
      type: 'box',
      layout: 'vertical',
      spacing: 'md',
      paddingAll: '20px',
      contents: [
        { type: 'text', text: 'คู่มือการใช้งานของเราแบ่งออกเป็น 2 ระดับ เพื่อให้ง่ายต่อการค้นหา:', wrap: true, size: 'sm', color: '#666666' },
        {
          type: 'button',
          action: {
            type: 'postback',
            label: '👶 ผู้ใช้ใหม่ (พนักงานทั่วไป)',
            data: 'action=show_level&level=beginner_new_user', // ใช้ action ใหม่เพื่อไปที่ beginnerMenu โดยตรง
            displayText: '👶 คู่มือฉบับเริ่มต้น'
          },
          style: 'primary',
          color: '#34A853',
          margin: 'lg'
        },
        {
          type: 'button',
          action: {
            type: 'postback',
            label: '🚀 ผู้ใช้เก่า (HR/Admin/หัวหน้า)',
            data: 'action=show_level&level=advance_old_user', // ใช้ action ใหม่เพื่อไปที่ mainMenu โดยตรง
            displayText: '🚀 คู่มือฉบับ Advance'
          },
          style: 'secondary',
          margin: 'sm'
        }
      ]
    }
  }
};

// ------------------------------------------------
// 5. Exports (ส่งออก 5 เมนูหลัก)
// ------------------------------------------------
module.exports = {
  mainMenu,
  levelSelectorMenu,
  beginnerMenu,
  beginnerContent,
  userRoleSelector // ⬅️ เพิ่มตัวนี้
};
