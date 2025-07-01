const express = require('express');
const axios = require('axios');
const flexMessage = require('./flexMessage'); // ดึง flex message เข้ามา

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const CHANNEL_ACCESS_TOKEN = 'LTvTIQbvACnHATlxrtwRxWjas16JaJ92+0BF9hD8ikIDMMvVB0dlWtv3wwe7tk2nop4OPcjdIs+0hxFiYtbVTLNfRnzaa2tso5NUakO/3cP5HhfarUGbsNymT7q9eu4GoXBv/hy3EO3iUl0jj2FsLwdB04t89/1O/w1cDnyilFU='; // แก้ตรงนี้

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/line-webhook', async (req, res) => {
  console.log('✅ ได้รับ Event จาก LINE:', JSON.stringify(req.body, null, 2));
  const events = req.body.events;

  for (let event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const replyToken = event.replyToken;
      const userText = event.message.text.trim();

      // เงื่อนไขเรียกเมนูหมวดหมู่
      if (userText === 'เมนูคู่มือ' || userText === 'menu') {
        const replyMessage = {
          replyToken,
          messages: [flexMessage]
        };

        try {
          await axios.post('https://api.line.me/v2/bot/message/reply', replyMessage, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
            }
          });
        } catch (error) {
          console.error('❌ Error sending Flex reply:', error.response?.data || error.message);
        }
      } else {
        // ตอบกลับข้อความทั่วไป
        const replyMessage = {
          replyToken,
          messages: [
            {
              type: 'text',
              text: `คุณพิมพ์ว่า: ${userText}`
            }
          ]
        };

        try {
          await axios.post('https://api.line.me/v2/bot/message/reply', replyMessage, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
            }
          });
        } catch (error) {
          console.error('❌ Error sending text reply:', error.response?.data || error.message);
        }
      }
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
