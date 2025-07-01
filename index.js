const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const CHANNEL_ACCESS_TOKEN = 'yvWPTSHyhfRW+JI7hvSfcOiE7vxToQnbgGx55usPsQm2Mzp4csN0kmduznG/JW7Oop4OPcjdIs+0hxFiYtbVTLNfRnzaa2tso5NUakO/3cNKXD6p/2T10Fk4191reuPS5KYQSxfrdGd1oq6z7eN4CQdB04t89/1O/w1cDnyilFU=';

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const events = req.body.events;

  events.forEach(event => {
    if (event.type === 'message' && event.message.type === 'text') {
      const replyToken = event.replyToken;
      const msg = {
        replyToken,
        messages: [{
          type: 'text',
          text: 'คุณพิมพ์ว่า: ' + event.message.text
        }]
      };

      fetch('https://api.line.me/v2/bot/message/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
        },
        body: JSON.stringify(msg)
      });
    }
  });

  res.status(200).send('OK');
});

app.get('/', (req, res) => {
  res.send('Line Webhook is working!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
