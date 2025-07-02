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
          paddingAll: '20px',
          spacing: 'lg',
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
                {
                  type: 'button',
                  style: 'secondary',
                  action: {
                    type: 'message',
                    label: '🖥 การใช้งานระบบทั่วไป',
                    text: 'การใช้งานระบบทั่วไป'
                  }
                },
                {
                  type: 'button',
                  style: 'secondary',
                  action: {
                    type: 'message',
                    label: '⚙ ตั้งค่าระบบและนโยบาย',
                    text: 'ตั้งค่าระบบและกำหนดนโยบาย'
                  }
                },
                {
                  type: 'button',
                  style: 'secondary',
                  action: {
                    type: 'message',
                    label: '👤 ข้อมูลบุคลากร',
                    text: 'การจัดการข้อมูลบุคลากร'
                  }
                },
                {
                  type: 'button',
                  style: 'secondary',
                  action: {
                    type: 'message',
                    label: '🔐 สิทธิการใช้งาน',
                    text: 'การจัดการสิทธิการใช้งาน'
                  }
                }
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
          paddingAll: '20px',
          spacing: 'lg',
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
                {
                  type: 'button',
                  style: 'secondary',
                  action: {
                    type: 'message',
                    label: '📆 การลา',
                    text: 'การตั้งค่าการลาและการลา'
                  }
                },
                {
                  type: 'button',
                  style: 'secondary',
                  action: {
                    type: 'message',
                    label: '🏢 โครงสร้าง/ตำแหน่ง',
                    text: 'โครงสร้างและตำแหน่ง'
                  }
                },
                {
                  type: 'button',
                  style: 'secondary',
                  action: {
                    type: 'message',
                    label: '📄 คำสั่ง',
                    text: 'การจัดการคำสั่ง'
                  }
                },
                {
                  type: 'button',
                  style: 'secondary',
                  action: {
                    type: 'message',
                    label: '📊 รายงาน',
                    text: 'การใช้รายงานและการสร้างรายงาน'
                  }
                }
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
          paddingAll: '20px',
          spacing: 'lg',
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
                {
                  type: 'button',
                  style: 'secondary',
                  action: {
                    type: 'message',
                    label: '✅ การประเมินผล',
                    text: 'ตั้งค่าการประเมินและการใช้งานการประเมิน'
                  }
                },
                {
                  type: 'button',
                  style: 'secondary',
                  action: {
                    type: 'message',
                    label: '📥 นำเข้า/ส่งออกข้อมูล',
                    text: 'การนำเข้า/ส่งออกข้อมูล'
                  }
                },
                {
                  type: 'button',
                  style: 'secondary',
                  action: {
                    type: 'message',
                    label: '💰 บริหารวงเงิน',
                    text: 'การบริหารวงเงิน'
                  }
                },
                {
                  type: 'button',
                  style: 'secondary',
                  action: {
                    type: 'message',
                    label: '📖 อื่นๆ',
                    text: 'คู่มืออื่นๆ ที่เกี่ยวข้อง'
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  }
};

const usageMenu = {
  type: 'flex',
  altText: 'เมนู “การใช้งานระบบทั่วไป”',
  contents: {
    type: 'bubble',
    size: 'mega',
    body: {
      type: 'box',
      layout: 'vertical',
      paddingAll: '20px',
      spacing: 'md',
      contents: [
        {
          type: 'text',
          text: '🔧 เมนู “การใช้งานระบบทั่วไป”',
          weight: 'bold',
          size: 'xl',
          color: '#1F2E55'
        },
        {
          type: 'box',
          layout: 'vertical',
          margin: 'lg',
          spacing: 'sm',
          contents: [
            { type: 'button', style: 'secondary', action: { type: 'message', label: '📌 ลงทะเบียนใช้งานครั้งแรก', text: 'ลงทะเบียนใช้งานครั้งแรก' } },
            { type: 'button', style: 'secondary', action: { type: 'message', label: '🔑 เปลี่ยนรหัสผ่าน (จำรหัสได้)', text: 'เปลี่ยนรหัสผ่าน (จำรหัสได้)' } },
            { type: 'button', style: 'secondary', action: { type: 'message', label: '🔀 เปลี่ยนรหัสผ่าน (ลืมรหัส)', text: 'เปลี่ยนรหัสผ่าน (ลืมรหัส)' } },
            { type: 'button', style: 'secondary', action: { type: 'message', label: '📵 ไม่มี OTP / ปิดหน้ากรอก', text: 'เปลี่ยนรหัสผ่าน (ไม่มี OTP)' } },
            { type: 'button', style: 'secondary', action: { type: 'message', label: '📧 อีเมลไม่ได้ รหัสผ่านขัดข้อง', text: 'เปลี่ยนรหัสผ่าน (อีเมลเข้าไม่ได้)' } },
            { type: 'button', style: 'secondary', action: { type: 'message', label: '👤 แก้โปรไฟล์ & ดูกิจกรรม', text: 'แก้โปรไฟล์และดูกิจกรรม' } },
            { type: 'button', style: 'secondary', action: { type: 'message', label: '🎭 เปลี่ยนบทบาทผู้ใช้งาน', text: 'เปลี่ยนบทบาทผู้ใช้งาน' } },
            { type: 'button', style: 'secondary', action: { type: 'message', label: '🇹🇭 เข้าระบบด้วย THAID', text: 'เข้าสู่ระบบด้วย THAID' } }
          ]
        }
      ]
    }
  }
};

module.exports = {
  mainMenu,
  usageMenu
};
