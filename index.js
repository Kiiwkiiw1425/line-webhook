const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { mainMenu } = require('./flexMessages');
const categoryMenus = require('./manual'); // โหลดทุกหมวดจาก manual/
const matchCategory = require('./utils/matchCategory'); // โหลดฟังก์ชันจับคำใกล้เคียง
const d6Help = require('./manual/d6-Help');
const d6Update = require('./manual/d6-Update');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;
const CHANNEL_ACCESS_TOKEN = 'LTvTIQbvACnHATlxrtwRxWjas16JaJ92+0BF9hD8ikIDMMvVB0dlWtv3wwe7tk2nop4OPcjdIs+0hxFiYtbVTLNfRnzaa2tso5NUakO/3cP5HhfarUGbsNymT7q9eu4GoXBv/hy3EO3iUl0jj2FsLwdB04t89/1O/w1cDnyilFU=';

app.post('/line-webhook', async (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));
  const events = req.body.events;

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userText = event.message.text.trim();
      const replyToken = event.replyToken;
      let message;

      if (userText === 'คู่มือการใช้งาน' || userText === 'คู่มือ') {
        message = mainMenu;
      } else if (categoryMenus[userText]) {
        message = categoryMenus[userText];
      } else {
        const matched = matchCategory(userText);
        if (matched && categoryMenus[matched]) {
          message = categoryMenus[matched];
        } else {
          message = null;
        }
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
  console.log(`🚀 Server is running on port ${PORT}`);
});
