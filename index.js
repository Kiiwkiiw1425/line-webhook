const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { mainMenu, usageMenu } = require('./flexMessages');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;
const CHANNEL_ACCESS_TOKEN = 'LTvTIQbvACnHATlxrtwRxWjas16JaJ92+0BF9hD8ikIDMMvVB0dlWtv3wwe7tk2nop4OPcjdIs+0hxFiYtbVTLNfRnzaa2tso5NUakO/3cP5HhfarUGbsNymT7q9eu4GoXBv/hy3EO3iUl0jj2FsLwdB04t89/1O/w1cDnyilFU=';// Channel Token

app.post('/webhook', async (req, res) => {
  const events = req.body.events;
  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userText = event.message.text;
      const replyToken = event.replyToken;
      let message;

      if (userText === 'เมนูหลัก' || userText === 'หมวดหมู่คู่มือ') {
        message = mainMenu;
      } else if (userText === 'การใช้งานระบบทั่วไป') {
        message = usageMenu;
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
  await axios.post(url, body, { headers });
}

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
