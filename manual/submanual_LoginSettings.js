// submanual_LoginSettings.js
const createSubmenu = require('../utils/createSubmenu');

const submanualLoginSettings = createSubmenu('🔒 กำหนดรูปแบบการเข้าสู่ระบบ', [
  { label: 'กำหนดรูปแบบการเข้าสู่ระบบ (Email หรือ ID Card with OTP to email)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/ETwgTtbDg4RPrFi17YEDaNMB-yv0px0wBfYaa20WixK0lg?e=mvHDgk' },
  { label: 'กำหนดรูปแบบการเข้าสู่ระบบ (LDAP)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/Eade9U6fhGlJpMkLyu1ssqIBwG38O0vBGkQ4UVhKJHzFFw?e=l0yOcG' },
  { label: 'กำหนดรูปแบบการเข้าสู่ระบบ (Smart Card)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/Edp_saUvNqBHpjpXr1HK0SoBHipNY3IZ6u5JgYV2aSNIDw?e=donLby' },
  { label: 'กำหนดรูปแบบการเข้าสู่ระบบ (Username และ Password)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/EQroPfCb7LJNtRw7Y-f3EZoBzFAI72Lnfuaob5TkyEaiMw?e=IF3gzT' },
  { label: 'กำหนดรูปแบบการเข้าสู่ระบบ (ThaID)', uri: 'https://ocscthailand.sharepoint.com/:b:/s/ictUnit-DPIS/Ee9T3Y4p9Irz5g6Z3h-fMB3v7j8N5x8q0b1v7j8N5x8q0b?e=hG8hI9' },
]);

module.exports = submanualLoginSettings;
