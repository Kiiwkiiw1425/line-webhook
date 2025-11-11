// index.js (หรือไฟล์ Line Message Handler หลัก)

// นำเข้า Flex Message และ Logic การค้นหา
const flexMessages = require('./flexMessages');
const { matchCategory } = require('./fuseConfig'); 

// คำที่ต้องการดักจับ (สำหรับแสดง userRoleSelector)
const GUIDE_KEYWORDS = ['คู่มือ', 'วิธีใช้', 'คู่มือการใช้งาน', 'เริ่มต้นใช้งาน'];

function handleUserMessage(userMessage) {
    const normalizedMessage = userMessage.toLowerCase().trim();

    // 1. Logic ดักจับคำหลัก 'คู่มือ', 'วิธีใช้' (ส่ง userRoleSelector)
    if (GUIDE_KEYWORDS.some(keyword => normalizedMessage.includes(keyword))) {
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
            // ถ้ามาจาก levelSelectorMenu (เดิม) สามารถใส่ logic ตรงนี้ได้
        }
        
        // จัดการ Postback จาก mainMenu (Advance)
        if (action === 'show_menu' && category) {
            // Logic เพื่อแสดงเมนูย่อยของหมวดหมู่ (ถ้ามี)
            // (ตัวอย่าง: return flexMessages.subMenus[category])
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
        // ถ้ามีการจับคู่ได้ ให้ส่งเมนูหมวดหมู่นั้นๆ (ขึ้นอยู่กับโครงสร้าง)
        // ตัวอย่าง: ถ้าเป็นคำทั่วไปที่อยู่ในหมวดหมู่ advance ให้แสดง mainMenu
        if (matchedCategory !== 'คำถาม/ช่วยเหลือ') {
             return flexMessages.mainMenu; 
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
