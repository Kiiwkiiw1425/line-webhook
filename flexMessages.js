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
      // Bubble 1
      {
        type: 'bubble',
        size: 'mega',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          paddingAll: '20px',
          backgroundColor: '#F9FBE7', // พื้นหลังเขียวอ่อน
          contents: [
            {
              type: 'text',
              text: '📚 เลือกหมวดหมู่คู่มือ',
              weight: 'bold',
              size: 'xl',
              color: '#1B5E20', // เขียวเข้ม
              align: 'center'
            },
            {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              contents: [
                { type: 'button', style: 'secondary', color: '#DCEDC8', action: { type: 'message', label: '🖥 การใช้งานระบบทั่วไป', text: 'การใช้งานระบบทั่วไป' } },
                { type: 'button', style: 'secondary', color: '#DCEDC8', action: { type: 'message', label: '⚙ ตั้งค่าระบบและนโยบาย', text: 'ตั้งค่าระบบและนโยบาย' } },
                { type: 'button', style: 'secondary', color: '#DCEDC8', action: { type: 'message', label: '👤 ข้อมูลบุคลากร', text: 'ข้อมูลบุคลากร' } },
                { type: 'button', style: 'secondary', color: '#DCEDC8', action: { type: 'message', label: '🔐 สิทธิการใช้งาน', text: 'สิทธิการใช้งาน' } }
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
          backgroundColor: '#F9FBE7',
          contents: [
            {
              type: 'text',
              text: '📚 หมวดหมู่เพิ่มเติม',
              weight: 'bold',
              size: 'xl',
              color: '#1B5E20',
              align: 'center'
            },
            {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              contents: [
                { type: 'button', style: 'secondary', color: '#DCEDC8', action: { type: 'message', label: '📆 การลา', text: 'การลา' } },
                { type: 'button', style: 'secondary', color: '#DCEDC8', action: { type: 'message', label: '🏢 โครงสร้าง/ตำแหน่ง', text: 'โครงสร้าง/ตำแหน่ง' } },
                { type: 'button', style: 'secondary', color: '#DCEDC8', action: { type: 'message', label: '📄 คำสั่ง', text: 'คำสั่ง' } },
                { type: 'button', style: 'secondary', color: '#DCEDC8', action: { type: 'message', label: '📊 รายงาน', text: 'รายงาน' } }
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
          backgroundColor: '#F9FBE7',
          contents: [
            {
              type: 'text',
              text: '📚 หมวดหมู่เพิ่มเติม',
              weight: 'bold',
              size: 'xl',
              color: '#1B5E20',
              align: 'center'
            },
            {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              contents: [
                { type: 'button', style: 'secondary', color: '#DCEDC8', action: { type: 'message', label: '✅ การประเมินผล', text: 'การประเมินผล' } },
                { type: 'button', style: 'secondary', color: '#DCEDC8', action: { type: 'message', label: '📥 นำเข้า/ส่งออกข้อมูล', text: 'นำเข้า/ส่งออกข้อมูล' } },
                { type: 'button', style: 'secondary', color: '#DCEDC8', action: { type: 'message', label: '💰 บริหารวงเงิน', text: 'บริหารวงเงิน' } },
                { type: 'button', style: 'secondary', color: '#DCEDC8', action: { type: 'message', label: '📖 อื่นๆ', text: 'อื่นๆ' } }
              ]
            }
          ]
        }
      }
    ]
  }
};
