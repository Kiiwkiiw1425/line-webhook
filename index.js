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

      let message;

      if (userText === 'การใช้งานระบบทั่วไป') {
  message = {
    type: 'flex',
    altText: 'เมนู: การใช้งานระบบทั่วไป',
    contents: {
      type: 'carousel',
      contents: [
        {
          type: 'bubble',
          header: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'เริ่มต้นใช้งาน',
                weight: 'bold',
                size: 'lg'
              }
            ]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            spacing: 'md',
            contents: [
              {
                type: 'button',
                style: 'primary',
                action: {
                  type: 'uri',
                  label: 'ลงทะเบียนใช้งานครั้งแรก',
                  uri: 'https://example.com/register'
                }
              },
              {
                type: 'button',
                style: 'primary',
                action: {
                  type: 'uri',
                  label: 'เปลี่ยนรหัส (จำรหัสได้)',
                  uri: 'https://example.com/change-password'
                }
              }
            ]
          }
        },
        {
          type: 'bubble',
          header: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'เปลี่ยนรหัสผ่าน',
                weight: 'bold',
                size: 'lg'
              }
            ]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            spacing: 'md',
            contents: [
              {
                type: 'button',
                style: 'primary',
                action: {
                  type: 'uri',
                  label: 'ลืมรหัสผ่าน',
                  uri: 'https://example.com/forgot-password'
                }
              },
              {
                type: 'button',
                style: 'primary',
                action: {
                  type: 'uri',
                  label: 'ไม่มี OTP / ปิดหน้า',
                  uri: 'https://example.com/no-otp'
                }
              }
            ]
          }
        },
        {
          type: 'bubble',
          header: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'ปัญหาอีเมล',
                weight: 'bold',
                size: 'lg'
              }
            ]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            spacing: 'md',
            contents: [
              {
                type: 'button',
                style: 'primary',
                action: {
                  type: 'uri',
                  label: 'อีเมลเข้าไม่ได้',
                  uri: 'https://example.com/email-issue'
                }
              },
              {
                type: 'button',
                style: 'primary',
                action: {
                  type: 'uri',
                  label: 'แก้ไขโปรไฟล์/ดูประวัติ',
                  uri: 'https://example.com/profile'
                }
              }
            ]
          }
        },
        {
          type: 'bubble',
          header: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'การเข้าสู่ระบบ',
                weight: 'bold',
                size: 'lg'
              }
            ]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            spacing: 'md',
            contents: [
              {
                type: 'button',
                style: 'primary',
                action: {
                  type: 'uri',
                  label: 'เปลี่ยนบทบาทผู้ใช้งาน',
                  uri: 'https://example.com/change-role'
                }
              },
              {
                type: 'button',
                style: 'primary',
                action: {
                  type: 'uri',
                  label: 'เข้าสู่ระบบด้วย THAID',
                  uri: 'https://example.com/thaid-login'
                }
              }
            ]
          }
        }
      ]
    }
  };
}
