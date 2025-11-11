// index.js (หรือไฟล์ Line Message Handler หลัก)

// ต้องนำเข้า 'url' สำหรับการใช้ URLSearchParams ใน Node.js บางเวอร์ชัน
const { URLSearchParams } = require('url'); 

// นำเข้า Flex Message และ Logic การค้นหา
const flexMessages = require('./flexMessages');
const { matchCategory } = require('./fuseConfig'); 

// คำที่ต้องการดักจับ (สำหรับแสดง userRoleSelector)
const GUIDE_KEYWORDS = ['คู่มือ', 'วิธีใช้', 'คู่มือการใช้งาน', 'เริ่มต้นใช้งาน'];

function handleUserMessage(userMessage) {
    // โค้ดนี้ถูกออกแบบมาเพื่อรองรับทั้งข้อความปกติและ postback data
    const normalizedMessage = userMessage.toLowerCase().trim();

    // 1. Logic ดักจับคำหลัก 'คู่มือ', 'วิธีใช้' (ส่ง userRoleSelector)
    if (GUIDE_KEYWORDS.some(keyword => normalizedMessage.includes(keyword)) && !normalizedMessage.startsWith('action=')) {
        // เพิ่มเงื่อนไข !normalizedMessage.startsWith('action=') เพื่อไม่ให้ดักจับ Postback ที่มีคำว่า 'คู่มือ'
        return flexMessages.userRoleSelector;
    }

    // 2. Logic จัดการ Postback Data (Postback Handler)
    if (normalizedMessage.startsWith('action=')) {
        const urlParams = new URLSearchParams(userMessage);
        const action = urlParams.get('action');
        const level = urlParams.get('level');
        const category = urlParams.get('category');
        const topic = urlParams.get('topic');

        // จัดการ Postback จาก userRoleSelector
        if (action === 'show_level') {
            if (level === 'beginner') {
                return flexMessages.beginnerMenu;
            } else if (level === 'advance') {
                return flexMessages.mainMenu;
            }
        }
        
        // จัดการ Postback จาก mainMenu (Advance)
        if (action === 'show_menu' && category) {
            // โค้ด Logic ในการแสดงเมนูย่อยของหมวดหมู่ Advance (ต้องมี Submenu Flex Message)
            // เช่น: return flexMessages.advancedSubMenus[category]; 
            // ตอนนี้ยังไม่มีเมนูย่อยจริง ๆ จึงขอส่งเป็นข้อความตอบกลับธรรมดา
            return { type: 'text', text: `กำลังแสดงเมนูสำหรับหมวดหมู่: ${category} (Advance)` };
        }

        // จัดการ Postback จาก beginnerMenu (Content)
        if (action === 'show_content' && topic) {
            return flexMessages.beginnerContent[topic];
        }

        // ... (เพิ่ม Postback Logic อื่นๆ)
    }


    // 3. Fallback Logic (ใช้ Fuse.js ค้นหา)
    const matchedCategory = matchCategory(userMessage);
    if (matchedCategory) {
        // ถ้าเป็นการค้นหาคำทั่วไปที่นำไปสู่หมวดหมู่ Advance ให้แสดง mainMenu
        if (['การใช้งานระบบทั่วไป', 'ตั้งค่าระบบ/นโยบาย', 'ข้อมูลบุคลากร', 'สิทธิการใช้งาน', 'การลา', 'โครงสร้าง/ตำแหน่ง', 'คำสั่ง/บัญชีแนบท้าย', 'รายงาน', 'การประเมินผล', 'นำเข้า/ส่งออกข้อมูล', 'บริหารวงเงิน', 'แอปพลิเคชัน'].includes(matchedCategory)) {
             return flexMessages.mainMenu; 
        }
        // ถ้าเป็นคำถาม/ช่วยเหลือ ก็ตอบเป็น Text ทั่วไป
        if (matchedCategory === 'คำถาม/ช่วยเหลือ') {
            return { type: 'text', text: 'ติดต่อเจ้าหน้าที่ หรือดูคำถามที่พบบ่อยได้ที่นี่ค่ะ' };
        }
    }

    // Default response (ไม่พบคำตอบ)
    return { type: 'text', text: 'ขออภัยค่ะ ไม่พบคำตอบที่เกี่ยวข้อง ลองพิมพ์ "คู่มือ" เพื่อเริ่มต้นใช้งาน หรือระบุคำค้นหาให้ชัดเจนขึ้น' };
}

// ------------------------------------------------
// Exports (ส่งออกฟังก์ชัน handler เพื่อให้ Line Bot Framework เรียกใช้)
// ------------------------------------------------
module.exports = {
    handleUserMessage
};
