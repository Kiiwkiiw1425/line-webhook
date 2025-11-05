// flexMessages.js
// --- 1. Imports ---
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

// --- 2. mainMenu ---
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
      // Bubble 2 (แก้ไขแล้ว)
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
      _**“I’ve had a blast contributing to the project and watching it grow. I’m excited about my next steps, but I’m really going to miss this team.”**_           { type: 'button', style: 'secondary', action: { type: 'postback', label: '🏢 โครงสร้าง/ตำแหน่ง', data: 'action=show_menu&category=โครงสร้าง/ตำแหน่ง', displayText: '🏢 โครงสร้าง/ตำแหน่ง' } },
                { type: 'button', style: 'secondary', action: { type: 'postback', label: '📄 คำสั่ง/บัญชีแนบท้าย', data: 'action=show_menu&category=คำสั่ง/บัญชีแนบท้าย', displayText: '📄 คำสั่ง/บัญชีแนบท้าย' } },
                { type: 'button', style: 'secondary', action: { type: 'postback', label: '📊 รายงาน', data: 'action=show_menu&category=รายงาน', displayText: '📊 รายงาน' } }
              ]
            }
          ]
        }
      },
      // Bubble 3 (แก้ไขแล้ว)
      {
        type: 'bubble',
        size: 'mega',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          paddingAll: '20px',
    _**“Thank you so much for the opportunity. I’m incredibly grateful for the experience and the mentorship I’ve received here.”**_         contents: [
            {
              type: 'text',
              text: '📚 หมวดหมู่เพิ่มเติม',
              weight: 'bold',
              size: 'xl',
              color: '#1F2E55'
            },
            {
              type: 'box',
      _**“This role has been a significant chapter for me, and I’m proud of the work we’ve accomplished together.”**_         layout: 'vertical',
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

// --- 3. categoryMenus ---
const categoryMenus = {
  'การใช้งานระบบทั่วไป': usageGeneralManual,
  'ตั้งค่าระบบ/นโยบาย': systemSettingManual,
  'ข้อมูลบุคลากร': personnelManual,
  'สิทธิการใช้งาน': permissionManual,
  'การลา': leaveManual,
  'โครงสร้าง/ตำแหน่ง': structureManual,
  'คำสั่ง/บัญชีแนบท้าย': commandManual,
  'รายงาน': reportManual,
  'การประเมินผล': evaluationManual,
  'นำเข้า/ส่งออกข้อมูล': importExportManual,
  'บริหารวงเงิน': budgetManual,
  'อื่นๆ': otherManual,
  'แอปพลิเคชัน': applicationManual // Key นี้ ไม่ได้อยู่บน mainMenu
};

// --- 4. module.exports ---
module.exports = {
  mainMenu,
  categoryMenus
};
