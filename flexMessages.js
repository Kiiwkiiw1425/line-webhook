// flexMessages.js

// ------------------------------------------------
// 1. mainMenu (L1 - Advance)
// ------------------------------------------------
const mainMenu = {
    type: 'flex',
    altText: '📚 เมนูเลือกหมวดหมู่คู่มือ (Advance)',
    contents: {
        type: 'carousel',
        contents: [
            // Bubble 1
            {
                type: 'bubble',
                body: {
                    type: 'box',
                    layout: 'vertical',
                    spacing: 'md',
                    paddingAll: '20px',
                    contents: [
                        {
                            type: 'text',
                            text: '📚 เลือกหมวดหมู่คู่มือ (1/3)',
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
            // Bubble 2
            {
                type: 'bubble',
                body: {
                    type: 'box',
                    layout: 'vertical',
                    spacing: 'md',
                    paddingAll: '20px',
                    contents: [
                        {
                            type: 'text',
                            text: '📚 หมวดหมู่ (2/3)',
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
                                { type: 'button', style: 'secondary', action: { type: 'postback', label: '🏢 โครงสร้าง/ตำแหน่ง', data: 'action=show_menu&category=โครงสร้าง/ตำแหน่ง', displayText: '🏢 โครงสร้าง/ตำแหน่ง' } },
                                { type: 'button', style: 'secondary', action: { type: 'postback', label: '📄 คำสั่ง/บัญชีแนบท้าย', data: 'action=show_menu&category=คำสั่ง/บัญชีแนบท้าย', displayText: '📄 คำสั่ง/บัญชีแนบท้าย' } },
                                { type: 'button', style: 'secondary', action: { type: 'postback', label: '📊 รายงาน', data: 'action=show_menu&category=รายงาน', displayText: '📊 รายงาน' } }
                            ]
                        }
                    ]
                }
            },
            // Bubble 3
            {
                type: 'bubble',
                body: {
                    type: 'box',
                    layout: 'vertical',
                    spacing: 'md',
                    paddingAll: '20px',
                    contents: [
                        {
                            type: 'text',
                            text: '📚 หมวดหมู่ (3/3)',
                            weight: 'bold',
                            size: 'xl',
                            color: '#1F2E55'
                        },
                        {
                            type: 'box',
                            layout: 'vertical',
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

// ------------------------------------------------
// 1.5. userRoleSelector (NEW)
// ------------------------------------------------
const userRoleSelector = {
    type: 'flex',
    altText: 'คุณเป็นผู้ใช้ใหม่หรือผู้ใช้เก่า?',
    contents: {
        type: 'bubble',
        size: 'kilo',
        header: {
            type: 'box',
            layout: 'vertical',
            paddingAll: '15px',
            backgroundColor: '#1F2E55',
            contents: [
                { type: 'text', text: '👋 โปรดเลือกประเภทผู้ใช้งาน', color: '#FFFFFF', size: 'lg', weight: 'bold' }
            ]
        },
        body: {
            type: 'box',
            layout: 'vertical',
            spacing: 'md',
            paddingAll: '20px',
            contents: [
                { type: 'text', text: 'คู่มือแบ่งออกเป็น 2 ระดับ เพื่อให้ง่ายต่อการค้นหา:', wrap: true, size: 'sm', color: '#666666' },
                {
                    type: 'button',
                    action: {
                        type: 'postback',
                        label: '👶 ผู้ใช้ใหม่ (พนักงานทั่วไป)',
                        data: 'action=show_level&level=beginner',
                        displayText: '👶 คู่มือฉบับเริ่มต้น'
                    },
                    style: 'primary',
                    color: '#34A853',
                    margin: 'lg'
                },
                {
                    type: 'button',
                    action: {
                        type: 'postback',
                        label: '🚀 ผู้ใช้เก่า (HR/Admin/หัวหน้า)',
                        data: 'action=show_level&level=advance',
                        displayText: '🚀 คู่มือฉบับ Advance'
                    },
                    style: 'secondary',
                    margin: 'sm'
                }
            ]
        }
    }
};

// ------------------------------------------------
// 2. levelSelectorMenu (L1) - เก็บไว้เป็นตัวเลือกเดิม
// ------------------------------------------------
const levelSelectorMenu = {
    type: 'flex',
    altText: 'เลือกประเภทคู่มือ',
    contents: {
        type: 'bubble',
        size: 'giga',
        header: {
            type: 'box',
            layout: 'vertical',
            paddingAll: '20px',
            backgroundColor: '#1F2E55',
            contents: [
                { type: 'text', text: 'เรียนรู้การใช้งาน DPIS6', color: '#FFFFFF', size: 'xl', weight: 'bold' }
            ]
        },
        body: {
            type: 'box',
            layout: 'vertical',
            spacing: 'lg',
            paddingAll: '20px',
            contents: [
                {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        { type: 'text', text: '👶 คู่มือฉบับเริ่มต้น', weight: 'bold', size: 'lg' },
                        { type: 'text', text: 'สำหรับพนักงานใหม่: เรียนรู้การลา, เบิกจ่าย, ดูสลิป', size: 'sm', wrap: true, margin: 'md' },
                        {
                            type: 'button',
                            action: { type: 'postback', label: 'เริ่มเรียน (มือใหม่)', data: 'action=show_level&level=beginner' },
                            style: 'primary',
                            margin: 'lg'
                        }
                    ]
                },
                { type: 'separator' },
                {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        { type: 'text', text: '🚀 คู่มือฉบับ Advance', weight: 'bold', size: 'lg' },
                        { type: 'text', text: 'สำหรับหัวหน้างาน, HR, Admin: การตั้งค่า, อนุมัติ, รายงาน', size: 'sm', wrap: true, margin: 'md' },
                        {
                            type: 'button',
                            action: { type: 'postback', label: 'ดูคู่มือ (Advance)', data: 'action=show_level&level=advance' },
                            style: 'secondary',
                            margin: 'lg'
                        }
                    ]
                }
            ]
        }
    }
};

// ------------------------------------------------
// 3. beginnerMenu (L2 - Beginner)
// ------------------------------------------------
const beginnerMenu = {
    type: 'flex',
    altText: 'สารบัญบทเรียนเริ่มต้น',
    contents: {
        type: 'carousel',
        contents: [
            // Module 1: ก้าวแรก
            {
                type: 'bubble',
                header: { type: 'box', layout: 'vertical', backgroundColor: '#F0F0F0', contents: [{ type: 'text', text: '🎯 Module 1: ก้าวแรก', weight: 'bold', margin: 'md', size: 'md'}] },
                body: {
                    type: 'box',
                    layout: 'vertical',
                    spacing: 'sm',
                    contents: [
                        { type: 'button', style: 'link', action: { type: 'postback', label: 'วิธีเข้าใช้งาน / Login', data: 'action=show_content&topic=login' } },
                        { type: 'button', style: 'link', action: { type: 'postback', label: 'ลืมรหัสผ่าน ทำยังไง?', data: 'action=show_content&topic=forgot_password' } },
                        { type: 'button', style: 'link', action: { type: 'postback', label: 'ทัวร์หน้าจอหลัก', data: 'action=show_content&topic=dashboard' } }
                    ]
                }
            },
            // Module 2: ภารกิจยอดฮิต
            {
                type: 'bubble',
                header: { type: 'box', layout: 'vertical', backgroundColor: '#F0F0F0', contents: [{ type: 'text', text: '🎯 Module 2: ภารกิจยอดฮิต', weight: 'bold', margin: 'md', size: 'md'}] },
                body: {
                    type: 'box',
                    layout: 'vertical',
                    spacing: 'sm',
                    contents: [
                        { type: 'button', style: 'link', action: { type: 'postback', label: 'วิธียื่นใบลา', data: 'action=show_content&topic=leave' } },
                        { type: 'button', style: 'link', action: { type: 'postback', label: 'วิธีดูสลิปเงินเดือน', data: 'action=show_content&topic=payroll' } },
                        { type: 'button', style: 'link', action: { type: 'postback', label: 'วิธียื่นเบิกจ่าย', data: 'action=show_content&topic=reimburse' } }
                    ]
                }
            }
        ]
    }
};

// ------------------------------------------------
// 4. beginnerContent (L3 - Content Map)
// ------------------------------------------------
const beginnerContent = {
    'leave': {
        type: 'flex',
        altText: 'วิธียื่นใบลา',
        contents: {
            type: 'bubble',
            size: 'giga',
            header: { type: 'box', layout: 'vertical', backgroundColor: '#1F2E55', contents: [{ type: 'text', text: 'บทเรียน: วิธียื่นใบลา', weight: 'bold', color: '#FFFFFF', margin: 'md', size: 'lg'}] },
            body: {
                type: 'box',
                layout: 'vertical',
                paddingAll: '20px',
                spacing: 'md',
                contents: [
                    { type: 'text', text: 'การยื่นใบลาใน DPIS6 มี 4 ขั้นตอนง่ายๆ ดังนี้:', wrap: true },
                    { type: 'box', layout: 'baseline', spacing: 'md', contents: [{ type: 'text', text: '1️⃣', flex: 0 }, { type: 'text', text: 'ไปที่เมนู "ระบบงานลา" > "สร้างใบลา"', wrap: true }] },
                    { type: 'box', layout: 'baseline', spacing: 'md', contents: [{ type: 'text', text: '2️⃣', flex: 0 }, { type: 'text', text: 'เลือกประเภทการลา (ลาป่วย, ลากิจ, พักร้อน)', wrap: true }] },
                    { type: 'box', layout: 'baseline', spacing: 'md', contents: [{ type: 'text', text: '3️⃣', flex: 0 }, { type: 'text', text: 'เลือกวันที่ในปฏิทิน และใส่เหตุผล', wrap: true }] },
                    { type: 'box', layout: 'baseline', spacing: 'md', contents: [{ type: 'text', text: '4️⃣', flex: 0 }, { type: 'text', text: 'ตรวจสอบวันลาคงเหลือ แล้วกด "ยื่นส่ง"', wrap: true }] }
                ]
            },
            footer: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    { type: 'button', style: 'link', action: { type: 'uri', label: 'ดูวิดีโอ (60 วิ)', uri: 'https://youtube.com' } }
                ]
            }
        }
    },
    'payroll': { type: 'flex', altText: 'วิธีดูสลิปเงินเดือน', contents: { type: 'bubble', body: { type: 'box', layout: 'vertical', contents: [{ type: 'text', text: 'คุณสามารถดูสลิปเงินเดือนได้ที่เมนู "ข้อมูลส่วนตัว" > "สลิปเงินเดือน"', wrap: true }] } } },
    'login': { type: 'flex', altText: 'วิธีเข้าใช้งานระบบ', contents: { type: 'bubble', body: { type: 'box', layout: 'vertical', contents: [{ type: 'text', text: '💡 วิธีเข้าใช้งานระบบ: เข้าสู่ระบบด้วย Thai ID และรหัสผ่าน', wrap: true }] } } },
    'forgot_password': { 
        type: 'flex', 
        altText: 'ลืมรหัสผ่าน', 
        contents: { 
            type: 'bubble', 
            body: { 
                type: 'box', 
                layout: 'vertical', 
                contents: [{ type: 'text', text: '🔒 ลืมรหัสผ่าน: คลิก "ลืมรหัสผ่าน" ที่หน้าจอ Login เพื่อตั้งค่าใหม่', wrap: true }] 
            } 
        } 
    } // <--- ต้องมี comma ถ้ามีรายการถัดไป หรือไม่มี comma ถ้าเป็นรายการสุดท้าย
    // รายการที่เหลือหายไป
}; // <--- ปิด Object beginnerContent

// ------------------------------------------------
// 5. Exports
// ------------------------------------------------
module.exports = {
    mainMenu,
    levelSelectorMenu,
    beginnerMenu,
    beginnerContent,
    userRoleSelector
};
