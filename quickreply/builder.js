// quickreply/builder.js
function textWithQuickReply(text, items) {
  return {
    type: 'text',
    text,
    quickReply: {
      items: items.map(action => ({ type: 'action', action }))
    }
  };
}

function postbackAction(label, data, displayText = label) {
  return { type: 'postback', label, data, displayText };
}

module.exports = { textWithQuickReply, postbackAction };
``
