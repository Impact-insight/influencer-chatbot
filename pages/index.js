// pages/index.js
const chatbotHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Influencer Research Chatbot</title>
  <style>
    :root{
      --bg1:#004c97; --bg2:#001e60;
      --panel:#ffffff;
      --text:#0f172a; --muted:#64748b;
      --primary:#004c97; --primary-2:#001e60;
      --border:#e5e7eb;
      --shadow:0 10px 30px rgba(0,0,0,.25);
      --radius:16px;
    }
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0; font-family:Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      background:linear-gradient(135deg,var(--bg1),var(--bg2));
      color:var(--text);
      display:flex; align-items:center; justify-content:center;
      padding:24px;
    }
    .chat-shell{
      width:min(960px,100%);
      background:linear-gradient(180deg,rgba(255,255,255,.85),rgba(255,255,255,.9));
      backdrop-filter:saturate(1.2) blur(6px);
      box-shadow:var(--shadow);
      border-radius:var(--radius);
      overflow:hidden;
      border:1px solid rgba(255,255,255,.6);
    }
    .topbar{
      display:flex; align-items:center; justify-content:space-between;
      padding:14px 18px;
      background:linear-gradient(135deg,rgba(0,76,151,.96),rgba(0,30,96,.96));
      color:#fff;
    }
    .title{margin:0; font-size:16px; font-weight:600; letter-spacing:.2px}
    .status{display:flex; align-items:center; gap:8px; font-size:12px; opacity:.95}
    .dot{width:8px; height:8px; border-radius:99px; background:#22c55e; box-shadow:0 0 0 3px rgba(34,197,94,.25)}
    .window{
      background:var(--panel);
      padding:18px;
    }
    .log{
      height:58vh; min-height:320px; max-height:62vh;
      overflow:auto; border:1px solid var(--border);
      border-radius:12px; padding:14px; background:#f8fafc;
    }
    .row{display:flex; gap:10px; margin:10px 0}
    .bubble{
      padding:10px 12px; border-radius:12px; max-width:75%;
      white-space:pre-wrap; line-height:1.45;
      border:1px solid var(--border);
      box-shadow:0 1px 2px rgba(0,0,0,.06);
    }
    .me{justify-content:flex-end}
    .me .bubble{background:#eaf2ff; border-color:#c7ddff}
    .bot .bubble{background:#eef2ff; border-color:#dbe3ff}
    .composer{display:flex; gap:10px; margin-top:12px}
    .composer input{
      flex:1; padding:12px 14px; border-radius:10px; border:1px solid var(--border);
      font-size:14px; outline:none;
    }
    .composer input:focus{border-color:#9ec0ff; box-shadow:0 0 0 3px rgba(0,76,151,.18)}
    .send{
      padding:12px 16px; border:none; border-radius:10px; cursor:pointer;
      color:#fff; background:linear-gradient(135deg,var(--primary),var(--primary-2));
      box-shadow:0 6px 16px rgba(0,30,96,.25); font-weight:600;
    }
    .send:disabled{opacity:.65; cursor:not-allowed}
    .typing{display:inline-flex; gap:4px; align-items:center; margin-left:4px}
    .typing span{width:6px; height:6px; background:#64748b; border-radius:99px; display:inline-block; opacity:.65;
      animation:blink 1.2s infinite}
    .typing span:nth-child(2){animation-delay:.2s}
    .typing span:nth-child(3){animation-delay:.4s}
    @keyframes blink{0%,80%,100%{opacity:.2} 40%{opacity:1}}
    .ticket{margin-top:6px; font-size:12px; color:var(--muted)}
  </style>
</head>
<body>
  <div class="chat-shell" role="region" aria-label="Influencer Research Chat">
    <div class="topbar">
      <h1 class="title">Influencer Research Assistant</h1>
      <div class="status"><span class="dot" aria-hidden="true"></span> Online</div>
    </div>

    <div class="window">
      <div id="log" class="log" aria-live="polite"></div>

      <div class="composer">
        <input id="msg" type="text" placeholder="Type here… e.g., ‘Infographic for Oren Cass’" autocomplete="off"/>
        <button id="send" class="send">Send</button>
      </div>
      <div id="ticket" class="ticket"></div>
    </div>
  </div>

<script>
(function(){
  const API = '/api/proxy';
  const el = (id)=>document.getElementById(id);

  function sessionId(){
    let s = localStorage.getItem('sessionId');
    if(!s){ s = 'web_' + Math.random().toString(36).slice(2) + Date.now(); localStorage.setItem('sessionId', s); }
    return s;
  }

  function add(role, text){
    const row = document.createElement('div');
    row.className = 'row ' + (role === 'me' ? 'me' : 'bot');
    const b = document.createElement('div');
    b.className = 'bubble';
    b.textContent = text;
    row.appendChild(b);
    el('log').appendChild(row);
    el('log').scrollTop = el('log').scrollHeight;
  }

  function addTyping(){
    const row = document.createElement('div');
    row.className = 'row bot'; row.id = 'typing';
    const b = document.createElement('div');
    b.className = 'bubble';
    b.innerHTML = 'typing<span class="typing"><span></span><span></span><span></span></span>';
    row.appendChild(b);
    el('log').appendChild(row);
    el('log').scrollTop = el('log').scrollHeight;
  }
  function removeTyping(){
    const t = document.getElementById('typing');
    if(t) t.remove();
  }

  add('bot',
    'Hi! I can help prepare the research.\\n' +
    '1) What should I produce (profile, infographic, or full research)?\\n' +
    '2) Who is the influencer (full name)? If there are several, I’ll list options.\\n' +
    '3) Prefer delivery via email or link?'
  );

  async function send(){
    const input = el('msg');
    const text = (input.value || '').trim();
    if(!text) return;
    add('me', text);
    input.value = '';
    el('send').disabled = true;
    addTyping();

    try{
      const r = await fetch(API, {
        method: 'POST',
        headers: {'content-type':'application/json'},
       body: JSON.stringify({ sessionId: sessionId(), chatInput: text })
      });
      removeTyping();
      let data = {};
      try { data = await r.json(); } catch {}
      if(data.reply) add('bot', data.reply);
      else if(!data.reply && r.status !== 200) add('bot', 'Server responded ' + r.status);
      if(data.ticket) el('ticket').textContent = 'Ticket: ' + data.ticket;
    }catch(e){
      removeTyping();
      add('bot','Error contacting server.');
    }finally{
      el('send').disabled = false;
    }
  }

  el('send').addEventListener('click', send);
  el('msg').addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); send(); }
  });
})();
</script>
</body>
</html>`;

export default function Home() {
  return (
    <main style={{ height: '100vh', margin: 0, padding: 0 }}>
      <iframe
        title="Influencer Research Chatbot"
        srcDoc={chatbotHTML}
        style={{ border: 0, width: '100%', height: '100%' }}
        sandbox="allow-scripts allow-same-origin allow-downloads allow-popups"
      />
    </main>
  );
}
