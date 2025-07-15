// utils/matchCategory.js

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],    // ลบ
          dp[i][j - 1],    // เพิ่ม
          dp[i - 1][j - 1] // แทนที่
        );
      }
    }
  }
  return dp[m][n];
}

function matchCategory(userInput) {
  const text = userInput.toLowerCase();

  const keywordMap = {
    'การใช้งานระบบทั่วไป': [
      'ระบบทั่วไป', 'ใช้งาน', 'เข้าใช้งาน', 'เข้าสู่ระบบ', 'ล็อกอิน', 'login', 'sign in', 'signup',
      'ลงทะเบียน', 'สมัครใช้งาน', 'กิจกรรม', 'โปรไฟล์', 'เปลี่ยนบทบาท', 'thaiid', 'otp', 'รหัสผ่าน', 'forgot password'
    ],

    'ตั้งค่าระบบและนโยบาย': [
      'ตั้งค่า', 'นโยบาย', 'config', 'configuration', 'ตัวแปร', 'ระบบหลัก', 'ปีงบประมาณ',
      'การแสดงผล', 'menu config', 'เมนูด้านข้าง', 'ตรวจสอบระบบ', 'backup'
    ],

    'ข้อมูลบุคลากร': [
      'บุคลากร', 'เจ้าหน้าที่', 'ข้าราชการ', 'พนักงาน', 'ประวัติ', 'เพิ่มบุคลากร',
      'ประวัติการศึกษา', 'เงินเพิ่ม', 'เงินตำแหน่ง'
    ],

    'สิทธิการใช้งาน': [
      'สิทธิ์', 'สิทธิการใช้งาน', 'การเข้าถึง', 'access', 'permission', 'user group', 'มอบสิทธิ์'
    ],

    'การลา': [
      'ลา', 'ลางาน', 'ขอลา', 'วันลา', 'ยื่นลา', 'ลาออนไลน์', 'ใบลา', 'สิทธิลา'
    ],

    'โครงสร้าง/ตำแหน่ง': [
      'โครงสร้าง', 'องค์กร', 'ตำแหน่ง', 'แผนผัง', 'template ตำแหน่ง'
    ],

    'คำสั่ง': [
      'คำสั่ง', 'แนบท้าย', 'แต่งตั้ง', 'เลื่อนระดับ', 'มอบหมาย', 'บรรจุ'
    ],

    'รายงาน': [
      'รายงาน', 'แสดงรายงาน', 'สรุปผล', 'ข้อมูลสรุป', 'ออกรายงาน', 'dashboard'
    ],

    'การประเมินผล': [
      'ประเมิน', 'evaluation', 'performance', 'สมรรถนะ', 'รอบประเมิน'
    ],

    'นำเข้า/ส่งออกข้อมูล': [
      'นำเข้า', 'ส่งออก', 'import', 'export', 'excel', 'ข้อมูลนำเข้า'
    ],

    'บริหารวงเงิน': [
      'วงเงิน', 'งบประมาณ', 'budget', 'สิทธิวงเงิน', 'จัดสรรงบ', 'การบริหารวงเงิน'
    ],

    'อื่นๆ': [
      'อื่นๆ', 'อื่น ๆ', 'เบ็ดเตล็ด', 'miscellaneous', 'paint'
    ],
    'ช่วยเหลือ': [
       'ช่วยเหลือ', 'faq', 'ติดต่อ', 'support', 'คำถามที่พบบ่อย', 'admin'],
    
    'การอัปเดตระบบ': 
        ['อัปเดต', 'อัปเดตระบบ', 'อัปเดตประจำวัน', 'status', 'สถานะ dpis6']
  };

  // ค้นหาตรงก่อน
  for (const [category, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
      return category;
    }
  }

  // ถ้าไม่ตรง ลอง Fuzzy
  let bestMatch = null;
  let bestScore = Infinity;
  const threshold = 2; // ระยะห่างที่ยอมรับได้ (1-2 คือพิมพ์ผิด 1-2 ตัวอักษร)

  for (const [category, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      const distance = levenshtein(text, keyword.toLowerCase());
      if (distance < bestScore && distance <= threshold) {
        bestMatch = category;
        bestScore = distance;
      }
    }
  }

  return bestMatch;
}

module.exports = matchCategory;
