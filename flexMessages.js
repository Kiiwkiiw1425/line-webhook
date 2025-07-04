// flexMessages.js
const usageGeneralManual = require('./manual/manualUsageGeneral');
const systemSettingManual = require('./manual/manualSystemSetting');
const personnelManual = require('./manual/manualPersonnel');
const permissionManual = require('./manual/manualPermission');
const leaveManual = require('./manual/manualLeave');
const structureManual = require('./manual/manualStructure');
const commandManual = require('./manual/manualCommand');
const reportManual = require('./manual/manualReport');
const evaluationManual = require('./manual/manualEvaluation');
const importExportManual = require('./manual/manualImportExport');
const budgetManual = require('./manual/manualBudget');
const otherManual = require('./manual/manualOther');
const applicationManual = require('./manual/manualApplication');

const mainMenu = {
  type: 'flex',
  altText: '📚 เมนูเลือกหมวดหมู่คู่มือ',
  contents: {
    type: 'carousel',
    contents: [
      // 🔹 บับเบิล 1
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

      // 🔹 บับเบิล 2
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

      // 🔹 บับเบิล 3
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
                { type: 'button', style: 'secondary', action: { type: 'message', label: '📖 อื่นๆ', text: 'อื่นๆ' } },
                { type: 'button', style: 'secondary', action: { type: 'message', label: '📱 แอปพลิเคชัน', text: 'แอปพลิเคชัน' } }
              ]
            }
          ]
        }
      },

      // 🆘 บับเบิลช่วยเหลือ
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
              text: '🆘 ช่วยเหลือ',
              weight: 'bold',
              size: 'xl',
              color: '#B71C1C'
            },
            {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              contents: [
                { type: 'button', style: 'primary', color: '#F44336', action: { type: 'uri', label: '📄 คำถามที่พบบ่อย', uri: 'https://yourdomain.com/faq' } },
                { type: 'button', style: 'primary', color: '#FF7043', action: { type: 'message', label: '💬 ติดต่อแอดมิน', text: 'แอดมิน' } }
              ]
            }
          ]
        }
      },

      // 🛠 บับเบิลอัปเดตระบบ
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
              text: '🛠 การอัปเดตระบบ',
              weight: 'bold',
              size: 'xl',
              color: '#33691E'
            },
            {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              contents: [
                { type: 'button', style: 'primary', color: '#689F38', action: { type: 'uri', label: '📅 อัปเดตประจำวัน', uri: 'https://yourdomain.com/daily-updates' } },
                { type: 'button', style: 'primary', color: '#558B2F', action: { type: 'uri', label: '📡 สถานะใช้งาน DPIS6', uri: 'https://yourdomain.com/dpis-status' } }
              ]
            }
          ]
        }
      }
    ]
  }
};

// รวม manual ทั้งหมด
const categoryMenus = {
  'การใช้งานระบบทั่วไป': usageGeneralManual,
  'ตั้งค่าระบบและนโยบาย': systemSettingManual,
  'ข้อมูลบุคลากร': personnelManual,
  'สิทธิการใช้งาน': permissionManual,
  'การลา': leaveManual,
  'โครงสร้าง/ตำแหน่ง': structureManual,
  'คำสั่ง': commandManual,
  'รายงาน': reportManual,
  'การประเมินผล': evaluationManual,
  'นำเข้า/ส่งออกข้อมูล': importExportManual,
  'บริหารวงเงิน': budgetManual,
  'อื่นๆ': otherManual,
  'แอปพลิเคชัน': applicationManual
};

module.exports = {
  mainMenu,
  categoryMenus
};
