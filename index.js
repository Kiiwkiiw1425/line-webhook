const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const CHANNEL_ACCESS_TOKEN = 'yvWPTSHyhfRW+JI7hvSfcOiE7vxToQnbgGx55usPsQm2Mzp4csN0kmduznG/JW7Oop4OPcjdIs+0hxFiYtbVTLNfRnzaa2tso5NUakO/3cNKXD6p/2T10Fk4191reuPS5KYQSxfrdGd1oq6z7eN4CQdB04t89/1O/w1cDnyilFU='; // แก้ตรงนี้

app.post('/line-webhook', async (req, res) => {
  const events = req.body.events;

  for (let event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const replyToken = event.replyToken;
      const userText = event.message.text.trim();

      // สร้างข้อความตอบกลับ (Echo ข้อความกลับไป)
      const replyMessage = {
        replyToken: replyToken,
        messages: [
          {
            type: 'text',
            text: `คุณพิมพ์ว่า: ${userText}`
          }
        ]
      };

      try {
        // ส่ง reply message ไปยัง LINE Messaging API
        await axios.post('https://api.line.me/v2/bot/message/reply', replyMessage, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
          }
        });
      } catch (error) {
        console.error('Error sending reply:', error.response ? error.response.data : error.message);
      }
    }
  }

  // ส่ง HTTP 200 OK กลับไปแจ้งว่า webhook รับข้อมูลเรียบร้อยแล้ว
  res.sendStatus(200);
});
