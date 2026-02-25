// ====== 1) Copilot Agent Callback (ให้ Copilot เรียกออกมา) ======
app.post('/copilot', async (req, res) => {
  try {
    const { query } = req.body || {};
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Invalid payload. Expecting { query: string }' });
    }

    // TODO: ต่อเติม logic ตามต้องการ เช่น:
    // - จับ intent เพื่อเลือกตอบจาก knowledge/manual เดิม
    // - ค้นฐานข้อมูลภายใน
    // - หรือแม้แต่ส่งข้อความเข้าห้อง/ผู้ใช้ใน LINE (กรณีจำเป็น)

    // ตัวอย่างง่าย: ใช้ matcher เดิมของคุณเพื่อคืนเมนูที่เกี่ยวข้อง
    let answerText = '';
    const exactMenu = categoryMenus[query];
    if (exactMenu) {
      // กรณีต้องการแปลง Flex เป็นข้อความสั้น (ให้ Agent เข้าใจ/อ่านออก)
      answerText = 'พบเมนูที่เกี่ยวข้อง: ลองพิมพ์ "คู่มือ" เพื่อดูเมนูหลัก หรือระบุหมวดให้ชัดเจนอีกครั้ง';
    } else {
      const matched = matchCategory(query);
      if (matched && categoryMenus[matched]) {
        answerText = `คำค้นของคุณใกล้เคียงกับหมวด: ${matched} \nลองพิมพ์ชื่อหมวด "${matched}" ใน LINE เพื่อดูรายละเอียด`;
      } else {
        // คำตอบเริ่มต้น (fallback) — คุณปรับให้เหมาะกับ DPIS6 ได้
        answerText = 'ขอบคุณครับ/ค่ะ รับทราบคำถามแล้ว ขอนำไปประมวลผลต่อ หากต้องการดูเมนูหลักให้พิมพ์ "คู่มือ"';
      }
    }

    // ส่งรูปแบบที่ Copilot Agent ต้องการ
    return res.json({ answer: answerText });

  } catch (err) {
    console.error('[/copilot] error:', err.message);
    return res.status(500).json({ error: 'Internal error' });
  }
});
