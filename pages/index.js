// pages/index.js
const chatbotHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Influencer Research Chatbot</title>
  <style>
    :root {
      --bg-primary:#f8fafc; --bg-secondary:#ffffff;
      --text-primary:#0f172a; --text-secondary:#475569; --text-muted:#64748b;
      --accent-primary:#004c97; --accent-secondary:#001e60;
      --border:#e2e8f0;
      --shadow-sm:0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow-md:0 4px 6px -1px rgb(0 0 0 / 0.1),0 2px 4px -2px rgb(0 0 0 / 0.1);
      --shadow-lg:0 10px 15px -3px rgb(0 0 0 / 0.1),0 4px 6px -4px rgb(0 0 0 / 0.1);
      --radius-sm:6px; --radius-md:8px; --radius-lg:12px;
    }
    *{box-sizing:border-box}
    body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:var(--bg-primary);margin:0;color:var(--text-primary);line-height:1.6}
    .header{
      background:linear-gradient(135deg,var(--accent-primary) 0%,var(--accent-secondary) 100%);
      color:#fff;padding:24px 20px;box-shadow:var(--shadow-lg)
    }
    .header h1{margin:0 0 8px;font-size:24px;font-weight:700}
    .header p{margin:0;opacity:.9;font-size:15px}

    .toolbar{background:var(--bg-secondary);border-bottom:1px solid var(--border);padding:16px 20px;box-shadow:var(--shadow-sm);position:sticky;top:0;z-index:10}
    .toolbar-grid{display:grid;grid-template-columns:1fr auto;gap:16px;align-items:center}
    .toolbar-left{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
    .control-group{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .control-group label{font-size:13px;font-weight:500;color:var(--text-secondary);white-space:nowrap}

    .btn{padding:8px 12px;border-radius:6px;border:1px solid var(--border);background:#fff;color:var(--text-primary);font-size:13px;font-weight:500;cursor:pointer;transition:.15s}
    .btn:hover{background:var(--bg-primary);border-color:var(--accent-primary)}
    .btn:disabled{opacity:.6;cursor:not-allowed}

    select,input[type="text"],input[type="search"],input[type="password"],input[type="email"]{
      padding:8px 10px;border-radius:6px;border:1px solid var(--border);background:#fff;color:var(--text-primary);font-size:13px;transition:.15s
    }
    select:focus,input:focus{outline:none;border-color:var(--accent-primary);box-shadow:0 0 0 3px rgb(0 76 151 / 0.15)}
    .status{font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:8px}

    .main-content{padding:20px}
    .grid{display:grid;grid-template-columns:1fr;gap:20px}
    .card{background:#fff;border-radius:12px;box-shadow:var(--shadow-md);padding:20px;border:1px solid transparent;transition:.2s}
    .card:hover{transform:translateY(-2px);box-shadow:var(--shadow-lg);border-color:var(--border)}

    /* Chat panel */
    .chat-log{height:52vh;min-height:260px;overflow:auto;border:1px solid var(--border);border-radius:12px;padding:12px;background:#f1f5f9}
    .msg{display:flex;gap:10px;margin:10px 0}
    .bubble{padding:10px 12px;border-radius:12px;max-width:85%;white-space:pre-wrap}
    .me{justify-content:flex-end}
    .me .bubble{background:#e0ecff;border:1px solid #c7ddff}
    .bot .bubble{background:#eef2ff;border:1px solid #dbe3ff}
    .chat-input{display:flex;gap:8px;margin-top:12px}
    .chat-input input{flex:1}
    .hidden{display:none}
    .kbd{font-family:ui-monospace,Menlo,Consolas,monospace;background:#eef2ff;border:1px solid #c7d2fe;padding:1px 6px;border-radius:6px;color:#3730a3}

    @media (max-width:768px){.toolbar-grid{grid-template-columns:1fr}.main-content{padding:16px}}
  </style>
</head>
<body>
  <header class="header">
    <h1>Influencer Research Chatbot</h1>
    <p>Password-gated chat intake that clarifies who to research and what to produce, then forwards to n8n via <span class="kbd">/api/proxy</span>.</p>
  </header>

  <div class="toolbar">
    <div class="toolbar-grid">
      <div class="toolbar-left">
        <!-- Login -->
        <div class="control-group" id="loginRow">
          <label for="pass">Access code</label>
          <input id="pass" type="password" placeholder="Enter password"/>
          <button id="loginBtn" class="btn">Unlock</button>
        </div>

        <!-- Optional config (enabled after login) -->
        <div class="control-group">
          <label for="job">Job</label>
          <select id="job" disabled>
            <option value="">Let bot ask</option>
            <option value="profile">Profile</option>
            <option value="infographic">Infographic</option>
            <option value="full_research">Full research</option>
          </select>

          <label for="delivery">Delivery</label>
          <select id="delivery" disabled>
            <option value="">Let bot ask</option>
            <option value="link">Link</option>
            <option value="email">Email</option>
          </select>

          <input id="email" type="email" placeholder="Recipient email (if delivery=email)" disabled style="min-width:220px"/>
          <input id="workEmail" type="email" placeholder="(Optional) your work email" disabled style="min-width:220px"/>
        </div>
      </div>

      <div class="status">
        <span id="status">Locked</span>
        <span id="ticket" style="margin-left:12px;"></span>
      </div>
    </div>
  </div>

  <main class="main-content">
    <div class="grid">
      <section class="card">
        <h3 style="margin-top:0">Chat</h3>
        <div id="chatLockedHint" class="status">Enter the access code to start.</div>

        <div id="chatArea" class="hidden">
          <div id="log" class="chat-log"></div>
          <div class="chat-input">
            <input id="text" type="text" placeholder="Type here… (e.g., 'Infographic for Oren Cass')"/>
            <button id="send" class="btn">Send</button>
          </div>
        </div>
      </section>
    </div>
  </main>

<script>
const $ = (id) => document.getElementById(id);

function sid(){
  let s = localStorage.getItem("sessionId");
  if(!s){ s = "web_" + Math.random().toString(36).slice(2) + Date.now(); localStorage.setItem("sessionId", s); }
  return s;
}
function setStatus(t){ const el=$("status"); if(el) el.textContent=t; }
function enableControls(on){
  ["job","delivery","email","workEmail","text","send"].forEach(id=>{ const el=$(id); if(el) el.disabled = !on; });
}
function add(role, text){
  const log = $("log");
  const row = document.createElement("div");
  row.className = "msg " + (role === "me" ? "me" : "bot");
  const b = document.createElement("div");
  b.className = "bubble";
  b.textContent = text;
  row.appendChild(b);
  log.appendChild(row);
  log.scrollTop = log.scrollHeight;
}

/* ---- login ---- */
async function login(){
  const pass = $("pass").value.trim();
  if(!pass) return alert("Enter the password.");
  setStatus("Checking…");
  try{
    // Simple unlock using /api/auth?pass=
    const r = await fetch("/api/auth?pass=" + encodeURIComponent(pass));
    if(r.status !== 200) throw new Error("forbidden");
    $("chatLockedHint").classList.add("hidden");
    $("chatArea").classList.remove("hidden");
    enableControls(true);
    setStatus("Unlocked");
    add("bot",
      "Hi! I can help prepare the research.\\n" +
      "1) What should I produce (profile, infographic, or full research)?\\n" +
      "2) Who is the influencer (full name)? If there are several, I’ll list options.\\n" +
      "3) Prefer delivery via email or link?"
    );
  }catch{
    setStatus("Locked");
    alert("Access denied. Check the password with the team.");
  }
}

/* ---- send message ---- */
async function send(){
  const t = $("text");
  const v = (t.value || "").trim();
  if(!v) return;
  add("me", v);
  t.value = "";
  $("send").disabled = true;

  const payload = {
    sessionId: sid(),
    text: v,
    job: $("job").value || undefined,
    delivery: $("delivery").value || undefined,
    recipient_email: $("email").value || undefined,
    workEmail: $("workEmail").value || undefined
  };

  try{
    const r = await fetch("/api/proxy", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await r.json().catch(()=> ({}));
    if(data.reply) add("bot", data.reply);
    if(data.ticket) $("ticket").textContent = "Ticket: " + data.ticket;
    if(!data.reply && r.status !== 200) add("bot", "Server responded " + r.status);
  }catch{
    add("bot","Error contacting server.");
  }finally{
    $("send").disabled = false;
  }
}

/* ---- wire up ---- */
$("loginBtn").addEventListener("click", login);
$("send").addEventListener("click", send);
$("text").addEventListener("keydown", e => { if(e.key === "Enter") send(); });
$("delivery").addEventListener("change", () => {
  const needsEmail = $("delivery").value === "email";
  $("email").disabled = !needsEmail;
  if(!needsEmail) $("email").value = "";
});

setStatus("Locked");
enableControls(false);
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
