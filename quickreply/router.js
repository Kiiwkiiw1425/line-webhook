// quickreply/router.js
/**
 * Router สำหรับ postback data จาก Quick Reply
 * แนวคิด: "mode=ai", "mode=human", "cat=payment", "lang=th" ฯลฯ
 */
function parsePostbackData(data) {
  // data รูปแบบ key=value&key2=value2
  const map = {};
  data.split('&').forEach(pair => {
    const [k, v] = pair.split('=');
    if (k) map[k] = decodeURIComponent(v || '');
  });
  return map;
}

module.exports = { parsePostbackData };
