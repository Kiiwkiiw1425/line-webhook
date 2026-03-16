// services/notifyAgent.js
function newTicketRef() {
  return `TCK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function notifyAgent(event, context = {}) {
  const ref = newTicketRef();
  const userId = event.source.userId || event.source.groupId || event.source.roomId;
  const last = context.lastUserText || '[N/A]';
  console.log(`[AGENT] user=${userId} ref=${ref} last="${last}"`);

  // TODO: ส่งไป Slack/LINE group/CRM/email ฯลฯ

  return ref;
}

module.exports = { notifyAgent };
