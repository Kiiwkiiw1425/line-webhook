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
            { type: 'button', style: 'secondary', action: { type: 'uri', label: '📌 ลงทะเบียนใช้งานครั้งแรก', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EX0QNBk-xCtAuJvgtZROkjwBdhmaMo5kGPz9KVggPe328Q?e=cOCn3k' } },
            { type: 'button', style: 'secondary', action: { type: 'uri', label: '🔑 เปลี่ยนรหัสผ่าน (จำรหัสได้)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EcOznyF3GF9Gqpt2cFRZS5IB8nHIaDuaX6hcrbeTaX9ssQ?e=4cQB7J' } },
            { type: 'button', style: 'secondary', action: { type: 'uri', label: '🔀 เปลี่ยนรหัสผ่าน (ลืมรหัส)', uri: 'https://example.com/manuals/change-password-forgot.pdf' } },
            { type: 'button', style: 'secondary', action: { type: 'uri', label: '📵 ไม่มี OTP / ปิดหน้ากรอก', uri: 'https://example.com/manuals/no-otp.pdf' } },
            { type: 'button', style: 'secondary', action: { type: 'uri', label: '📧 อีเมลไม่ได้ รหัสผ่านขัดข้อง', uri: 'https://example.com/manuals/email-error.pdf' } },
            { type: 'button', style: 'secondary', action: { type: 'uri', label: '👤 แก้โปรไฟล์ & ดูกิจกรรม', uri: 'https://example.com/manuals/profile-activity.pdf' } },
            { type: 'button', style: 'secondary', action: { type: 'uri', label: '🎭 เปลี่ยนบทบาทผู้ใช้งาน', uri: 'https://example.com/manuals/role-switch.pdf' } },
            { type: 'button', style: 'secondary', action: { type: 'uri', label: '🇹🇭 เข้าระบบด้วย THAID', uri: 'https://example.com/manuals/thaid-login.pdf' } }
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
