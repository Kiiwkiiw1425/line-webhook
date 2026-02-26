// index.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const https = require('https');
const crypto = require('crypto');
const { mainMenu } = require('./flexMessages');
const categoryMenus = require('./manual');
const matchCategory = require('./utils/matchCategory');

const app = express();

// เก็บ raw body สำหรับตรวจลายเซ็น LINE
app.use(bodyParser.json({
  verify: (req, _res, buf) => { req.rawBody = buf; }
}));

// --- axios defaults: timeout + keep-alive ---
const httpAgent = new https.Agent({ keepAlive: true });
axios.defaults.timeout = 10000; // 10s
axios.defaults.httpsAgent = httpAgent;

const PORT = process.env.PORT || 10000;
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
const CHANNEL_SECRET = process.env.CHANNEL_SECRET;
const COPILOT_KEY = process.env.COPILOT_KEY;
const NODE_ENV = process.env.NODE_ENV || 'development';

if (!CHANNEL_ACCESS_TOKEN) {
  console.error('❌ CHANNEL_ACCESS_TOKEN is not set');
  process.exit(1);
}
if (NODE_ENV === 'production' && !CHANNEL_SECRET) {
  console.error('❌ CHANNEL_SECRET is not set (required in production)');
  process.exit(1);
}
if (NODE_ENV === 'production' && !COPILOT_KEY) {
  console.error('❌ COPILOT_KEY is not set (required in production)');
  process.exit(1);
}

// ===== util: ตรวจลายเซ็นจาก LINE (ต้องใช้ raw body) =====
function verifyLineSignature(req) {
  if (!CHANNEL_SECRET) return true; // allow in non-production/testing
  const signature = req.headers['x-line-signature'];
  if (!signature || !req.rawBody) return false;
  const expected = crypto
    .createHmac('sha256', CHANNEL_SECRET)
    .update(req.rawBody)
    .digest('base64');
  return signature === expected;
}

// ===== util: ตอบกลับ LINE =====
async function replyToLine(replyToken, message) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
  };
  const body = { replyToken, messages: [message] };

  try {
    await axios.post(url, body, { headers });
  } catch (err) {
    console.error('LINE Reply Error:', err.response?.data || err.message);
  }
}

// ===== LINE Webhook =====
app.post('/line-webhook', async (req, res) => {
  if (!verifyLineSignature(req)) return res.sendStatus(403);

  const events = req.body.events || [];
  // ตอบ 200 เร็ว ๆ ก่อน (หากต้องการประมวลผลหนักให้ส่งไป queue)
  res.sendStatus(200);

  for (const event of events) {
    try {
      if (event.type === 'message' && event.message.type === 'text') {
        const userText = (event.message.text || '').trim();
        const replyToken = event.replyToken;
