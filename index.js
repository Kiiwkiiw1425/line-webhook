const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;

const CHANNEL_ACCESS_TOKEN = 'LTvTIQbvACnHATlxrtwRxWjas16JaJ92+0BF9hD8ikIDMMvVB0dlWtv3wwe7tk2nop4OPcjdIs+0hxFiYtbVTLNfRnzaa2tso5NUakO/3cP5HhfarUGbsNymT7q9eu4GoXBv/hy3EO3iUl0jj2FsLwdB04t89/1O/w1cDnyilFU='; // แก้ตรงนี้

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/line-webhook', async (req, res) => {
  console.log('🔔 webhook ถูกเรียกแล้ว');
  /*console.log('✅ ได้รับ Event จาก LINE:', JSON.stringify(req.body, null, 2));*/
  const events = req.body.events;

  for (let event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const replyToken = event.replyToken;
      const userText = event.message.text.trim();

      let replyText = '';

      if (userText === 'การใช้งานระบบทั่วไป') {
        replyText = 'นี่คือข้อมูลการใช้งานระบบทั่วไป:\n- ลงทะเบียนใช้งานครั้งแรก\n- เปลี่ยนรหัสผ่าน\n- ติดต่อฝ่ายสนับสนุน';
      } else {
        replyText = `คุณพิมพ์ว่า: ${userText}`;
      }

      const replyMessage = {
        replyToken,
        messages: [
          {
            type: 'text',
            text: replyText,
          },
        ],
      };

      try {
        await axios.post('https://api.line.me/v2/bot/message/reply', replyMessage, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
          },
        });
      } catch (error) {
        console.error('Error sending reply:', error.response ? error.response.data : error.message);
      }
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
