const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const CHANNEL_ACCESS_TOKEN = 'yvWPTSHyhfRW+JI7hvSfcOiE7vxToQnbgGx55usPsQm2Mzp4csN0kmduznG/JW7Oop4OPcjdIs+0hxFiYtbVTLNfRnzaa2tso5NUakO/3cNKXD6p/2T10Fk4191reuPS5KYQSxfrdGd1oq6z7eN4CQdB04t89/1O/w1cDnyilFU='; // แก้ตรงนี้

app.post('/webhook', async (req, res) => {
  const events = req.body.events;

  for (let event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const replyToken = event.replyToken;
      const userText = event.message.text.trim();

      let message;

      if (userText === 'การใช้งานระบบทั่วไป') {
        message = {
          type: 'flex',
          altText: 'เมนูการใช้งานระบบทั่วไป',
          contents: {
            type: 'bubble',
            header: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: 'การใช้งานระบบทั่วไป',
                  weight: 'bold',
                  size: 'lg'
                }
              ]
            },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'button',
                  style: 'primary',
                  action: {
                    type: 'uri',
                    label: 'เปิดคู่มือ',
                    uri: 'https://example.com/manual'
                  }
                }
              ]
            }
          }
        };
      } else {
        message = {
          type: 'text',
          text: `คุณพิมพ์ว่า: ${userText}`
        };
      }

      await axios.post('https://api.line.me/v2/bot/message/reply', {
        replyToken: replyToken,
        messages: [message]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
        }
      });
    }
  }

  res.sendStatus(200);
});
