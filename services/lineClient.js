// services/lineClient.js
const axios = require('axios');

const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
if (!CHANNEL_ACCESS_TOKEN) {
  console.error('❌ CHANNEL_ACCESS_TOKEN not set');
  process.exit(1);
}

const LINE_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
};

async function reply(replyToken, messages) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const body = { replyToken, messages: Array.isArray(messages) ? messages : [messages] };
  try {
    await axios.post(url, body, { headers: LINE_HEADERS });
  } catch (err) {
    console.error('LINE Reply Error:', err.response?.data || err.message);
  }
}

async function push(to, messages) {
  const url = 'https://api.line.me/v2/bot/message/push';
  const body = { to, messages: Array.isArray(messages) ? messages : [messages] };
  try {
    await axios.post(url, body, { headers: LINE_HEADERS });
  } catch (err) {
    console.error('LINE Push Error:', err.response?.data || err.message);
  }
}

module.exports = { reply, push };
