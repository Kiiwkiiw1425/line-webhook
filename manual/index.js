const usageGeneral = require('./manualUsageGeneral');
const systemSetting = require('./manualSystemSetting');
const personnel = require('./manualPersonnel');
const permission = require('./manualPermission');
const leave = require('./manualLeave');
const structure = require('./manualStructure');
const command = require('./manualCommand');
const report = require('./manualReport');
const evaluation = require('./manualEvaluation');
const dataImportExport = require('./manualImportExport');
const budget = require('./manualBudget');
const other = require('./manualOther');

const categoryMenus = {
  'การใช้งานระบบทั่วไป': usageGeneral,
  'ตั้งค่าระบบและนโยบาย': systemSetting,
  'ข้อมูลบุคลากร': personnel,
  'สิทธิการใช้งาน': permission,
  'การลา': leave,
  'โครงสร้าง/ตำแหน่ง': structure,
  'คำสั่ง': command,
  'รายงาน': report,
  'การประเมินผล': evaluation,
  'นำเข้า/ส่งออกข้อมูล': dataImportExport,
  'บริหารวงเงิน': budget,
  'อื่นๆ': other
};

module.exports = categoryMenus;
