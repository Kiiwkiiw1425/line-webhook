// flexMessages.js

// ------------------------------------------------
// 1. mainMenu (L1 - Advance)
// ------------------------------------------------
const mainMenu = {
  type: 'flex',
  altText: '📚 เมนูเลือกหมวดหมู่คู่มือ (Advance)',
  contents: {
    type: 'carousel',
    contents: [
      // Bubble 1 (ไม่มี size ใน Carousel Bubble)
      {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          paddingAll: '20px',
          contents: [
            {
              type: 'text',
              text: '📚 เลือกหมวดหมู่คู่มือ (1/3)', // เพิ่มตัวนับหน้า
              weight: 'bold',
              size: 'xl',
              color: '#1F2E55'
            },
            {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              contents: [
                // **Postback Data Consistency Check: Key must match category name**
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
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          paddingAll: '20px',
          contents: [
            {
              type: 'text',
              text: '📚 หมวดหมู่ (2/3)', // เปลี่ยนชื่อหัวข้อเล็กน้อย
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
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          paddingAll: '20px',
          contents: [
            {
              type: 'text',
              text: '📚 หมวดหมู่ (3/3)', // เปลี่ยนชื่อหัวข้อเล็กน้อย
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

// ------------------------------------------------
// 2. levelSelectorMenu (L1) <-- เมนูที่ใช้เป็น Prompt สำหรับคำว่า 'คู่มือ'
// ------------------------------------------------
const levelSelectorMenu = {
  type: 'flex',
  altText: 'เลือกประเภทคู่มือ',
  contents: {
    type: 'bubble',
    size: 'mega', // <-- แก้ไขจาก giga เป็น mega
    header: {
      type: 'box',
      layout: 'vertical',
      paddingAll: '20px',
      backgroundColor: '#1F2E55',
      contents: [
        { type: 'text', text: 'ท่านเป็นผู้ใช้งานระดับใด?', color: '#FFFFFF', size: 'xl', weight: 'bold' }
      ]
    },
    body: {
      type: 'box',
      layout: 'vertical',
      spacing: 'lg',
      paddingAll: '20px',
      contents: [
        // --- 1. Beginner ---
        {
          type: 'box',
          layout: 'vertical',
          contents: [
            { type: 'text', text: '👶 ผู้ใช้ใหม่/พนักงานทั่วไป', weight: 'bold', size: 'lg' },
            { type: 'text', text: 'เข้าถึงคู่มือพื้นฐาน: การลา, ดูสลิป, ยื่นเบิกจ่าย', size: 'sm', wrap: true, margin: 'md' },
            { 
              type: 'button', 
              action: { type: 'postback', label: 'ผู้ใช้ใหม่ (Beginner)', data: 'action=show_level&level=beginner' },
              style: 'primary',
              margin: 'lg'
            }
          ]
        },
        { type: 'separator' },
        // --- 2. Advance ---
        {
          type: 'box',
          layout: 'vertical',
          contents: [
            { type: 'text', text: '🚀 ผู้ใช้เก่า/ผู้บริหาร/HR/Admin', weight: 'bold', size: 'lg' },
            { type: 'text', text: 'เข้าถึงคู่มือขั้นสูง: ตั้งค่า, อนุมัติ, รายงาน', size: 'sm', wrap: true, margin: 'md' },
            { 
              type: 'button', 
              action: { type: 'postback', label: 'ผู้ใช้เก่า (Advance)', data: 'action=show_level&level=advance' },
              style: 'secondary',
              margin: 'lg'
            }
          ]
        }
      ]
    }
  }
};

// ------------------------------------------------
// 3. beginnerMenu (L2 - Beginner)
// ------------------------------------------------
const beginnerMenu = {
  type: 'flex',
  altText: 'สารบัญบทเรียนเริ่มต้น',
  contents: {
    type: 'carousel',
    contents: [
      // Module 1: ก้าวแรก
      {
        type: 'bubble',
        header: { type: 'box', layout: 'vertical', backgroundColor: '#F0F0F0', contents: [{ type: 'text', text: '🎯 Module 1: ก้าวแรก', weight: 'bold', margin: 'md', size: 'md'}] },
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            { type: 'button', style: 'link', action: { type: 'postback', label: 'วิธีเข้าใช้งาน / Login', data: 'action=show_content&topic=login' } },
            { type: 'button', style: 'link', action: { type: 'postback', label: 'ลืมรหัสผ่าน ทำยังไง?', data: 'action=show_content&topic=forgot_password' } },
            { type: 'button', style: 'link', action: { type: 'postback', label: 'ทัวร์หน้าจอหลัก', data: 'action=show_content&topic=dashboard' } }
          ]
        }
      },
      // Module 2: ภารกิจยอดฮิต
      {
        type: 'bubble',
        header: { type: 'box', layout: 'vertical', backgroundColor: '#F0F0F0', contents: [{ type: 'text', text: '🎯 Module 2: ภารกิจยอดฮิต', weight: 'bold', margin: 'md', size: 'md'}] },
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            { type: 'button', style: 'link', action: { type: 'postback', label: 'วิธียื่นใบลา', data: 'action=show_content&topic=leave' } },
            { type: 'button', style: 'link', action: { type: 'postback', label: 'วิธีดูสลิปเงินเดือน', data: 'action=show_content&topic=payroll' } },
            { type: 'button', style: 'link', action: { type: 'postback', label: 'วิธียื่นเบิกจ่าย', data: 'action=show_content&topic=reimburse' } }
          ]
        }
      }
    ]
  }
};

// ------------------------------------------------
// 4. beginnerContent (L3 - Beginner)
// ------------------------------------------------
const beginnerContent = {
  // --- หัวข้อ "การลา" ---
  'leave': {
    type: 'flex',
    altText: 'วิธียื่นใบลา',
    contents: {
      type: 'bubble',
      size: 'giga',
      header: { type: 'box', layout: 'vertical', backgroundColor: '#1F2E55', contents: [{ type: 'text', text: 'บทเรียน: วิธียื่นใบลา', weight: 'bold', color: '#FFFFFF', margin: 'md', size: 'lg'}] },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '20px',
        spacing: 'md',
        contents: [
          { type: 'text', text: 'การยื่นใบลาใน DPIS6 มี 4 ขั้นตอนง่ายๆ ดังนี้:', wrap: true },
          { type: 'box', layout: 'baseline', spacing: 'md', contents: [{ type: 'text', text: '1️⃣', flex: 0 }, { type: 'text', text: 'ไปที่เมนู "ระบบงานลา" > "สร้างใบลา"', wrap: true }] },
          { type: 'box', layout: 'baseline', spacing: 'md', contents: [{ type: 'text', text: '2️⃣', flex: 0 }, { type: 'text', text: 'เลือกประเภทการลา (ลาป่วย, ลากิจ, พักร้อน)', wrap: true }] },
          { type: 'box', layout: 'baseline', spacing: 'md', contents: [{ type: 'text', text: '3️⃣', flex: 0 }, { type: 'text', text: 'เลือกวันที่ในปฏิทิน และใส่เหตุผล', wrap: true }] },
          { type: 'box', layout: 'baseline', spacing: 'md', contents: [{ type: 'text', text: '4️⃣', flex: 0 }, { type: 'text', text: 'ตรวจสอบวันลาคงเหลือ แล้วกด "ยื่นส่ง"', wrap: true }] }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'button', style: 'link', action: { type: 'uri', label: 'ดูวิดีโอ (60 วิ)', uri: 'https://youtube.com' } } 
        ]
      }
    }
  },
  // --- หัวข้อ "ดูสลิป" ---
  'payroll': {
    type: 'flex',
    altText: 'วิธีดูสลิปเงินเดือน',
    contents: {
      type: 'bubble',
      size: 'giga',
      header: { type: 'box', layout: 'vertical', backgroundColor: '#1F2E55', contents: [{ type: 'text', text: 'บทเรียน: วิธีดูสลิปเงินเดือน', weight: 'bold', color: '#FFFFFF', margin: 'md', size: 'lg'}] },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '20px',
        spacing: 'md',
        contents: [
          { type: 'text', text: 'คุณสามารถดูสลิปเงินเดือน (E-Payroll) ได้ 2 ขั้นตอน:', wrap: true },
          { type: 'box', layout: 'baseline', spacing: 'md', contents: [{ type: 'text', text: '1️⃣', flex: 0 }, { type: 'text', text: 'ไปที่เมนู "ข้อมูลส่วนตัว" > "สลิปเงินเดือน"', wrap: true }] },
          { type: 'box', layout: 'baseline', spacing: 'md', contents: [{ type: 'text', text: '2️⃣', flex: 0 }, { type: 'text', text: 'เลือกเดือนที่ต้องการดู และกด "ค้นหา"', wrap: true }] }
        ]
      }
    }
  },
  // เนื้อหาที่เหลือ (ใช้เป็น Flex Message)
  'login': { 
    type: 'flex', 
    altText: 'วิธีเข้าใช้งานระบบ', 
    contents: { 
      type: 'bubble', 
      body: { 
        type: 'box', 
        layout: 'vertical', 
        contents: [{ type: 'text', text: '💡 วิธีเข้าใช้งานระบบ:\nเข้าสู่ระบบด้วย Thai ID และรหัสผ่านที่คุณลงทะเบียนไว้', wrap: true }] 
      } 
    } 
  },
  'forgot_password': { 
    type: 'flex', 
    altText: 'ลืมรหัสผ่าน', 
    contents: { 
      type: 'bubble', 
      body: { 
        type: 'box', 
        layout: 'vertical', 
        contents: [{ type: 'text', text: '🔒 ลืมรหัสผ่าน:\nคลิก "ลืมรหัสผ่าน" ที่หน้าจอ Login เพื่อตั้งค่าใหม่', wrap: true }] 
      } 
    } 
  },
  'dashboard': { 
    type: 'flex', 
    altText: 'ทัวร์หน้าจอหลัก', 
    contents: { 
      type: 'bubble', 
      body: { 
        type: 'box', 
        layout: 'vertical', 
        contents: [{ type: 'text', text: '🧭 ทัวร์หน้าจอหลัก:\nประกอบด้วยเมนูหลัก, แถบสถานะ, และวิดเจ็ตสรุปข้อมูล', wrap: true }] 
      } 
    } 
  },
  'reimburse': { 
    type: 'flex', 
    altText: 'วิธียื่นเบิกจ่าย', 
    contents: { 
      type: 'bubble', 
      body: { 
        type: 'box', 
        layout: 'vertical', 
        contents: [{ type: 'text', text: '🧾 วิธียื่นเบิกจ่าย:\nไปที่เมนู "ระบบงานเบิกจ่าย" > "สร้างรายการเบิกจ่าย"', wrap: true }] 
      } 
    } 
  }
};

// ------------------------------------------------
// 5. Exports (ส่งออก 4 เมนูหลัก)
// ------------------------------------------------
module.exports = {
  mainMenu, 
  levelSelectorMenu, 
  beginnerMenu, 
  beginnerContent 
};
