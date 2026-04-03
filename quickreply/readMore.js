// quickreply/readMore.js
function readMoreQuickReply(flowId) {
  return {
    quickReply: {
      items: [
        {
          type: 'action',
          action: {
            type: 'postback',
            label: '🔍 อ่านรายละเอียดทั้งหมด',
            data: `readmore=${flowId}`
          }
        }
      ]
    }
  };
}

module.exports = { readMoreQuickReply };
