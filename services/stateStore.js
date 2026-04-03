const store = {};

function getState(id){ return store[id] || {}; }
function setState(id, s){ store[id] = {...getState(id), ...s}; }
function clearConversation(id){ delete store[id]; }

function shouldNotify(s={}){
  const now = Date.now();
  return now - (s.notifiedAt||0) > 3*60*1000;
}

function touch(id){
  setState(id,{
    lastActivity: Date.now(),
    promptedAfterInactive: false
  });
}

module.exports = { getState,setState,clearConversation,shouldNotify,touch };
