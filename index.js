const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { mainMenu, categoryMenus } = require('./flexMessages');
const matchCategory = require('./utils/matchCategory');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;

const CHANNEL_ACCESS_TOKEN = 'LTvTIQbvACnHATlxrtwRxWjas16JaJ92+0BF9hD8ikIDMMvVB0dlWtv3wwe7tk2nop4OPcjdIs+0hxFiYtbVTLNfRnzaa2tso5NUakO/3cP5HhfarUGbsNymT7q9eu4GoXBv/hy3EO3iUl0jj2FsLwdB04t89/1O/w1cDnyilFU=';

app.post('/line-webhook', async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userText = event.message.text.trim();
      const replyToken = event.replyToken;

      console.log('📩 ข้อความจากผู้ใช้:', userText);

      let message;

      if (userText.includes('คู่มือ')) {
        console.log('ตอบเมนูหลัก');
        message = mainMenu;
      } else if (categoryMenus[userText]) {
        console.log('ตอบเมนูหมวด:', userText);
        message = categoryMenus[userText];
      } else {
        console.log('ไม่พบเมนูที่ตรง');
        message = null;
      }

      if (message) {
        await replyToLine(replyToken, message);
      }
    }
  }

  res.sendStatus(200);
});

async function replyToLine(replyToken, message) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
  };

  const body = {
    replyToken,
    messages: [message]
  };

  try {
    await axios.post(url, body, { headers });
  } catch (error) {
    console.error('LINE Reply Error:', error.response?.data || error.message);
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
