//flexMessages.js

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

// รวม manual ทั้ง 12 หมวดไว้ในออบเจกต์เดียว
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
  'อื่นๆ': otherManual
};

module.exports = {
  mainMenu,
  categoryMenus
};
