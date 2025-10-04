export default function Login() {
  return (
    <main style={{display:'grid',placeItems:'center',minHeight:'100vh',fontFamily:'system-ui'}}>
      <form id="login" style={{border:'1px solid #e5e7eb',padding:24,borderRadius:12,boxShadow:'0 4px 10px rgba(0,0,0,.06)'}}>
        <input id="pwd" type="password" placeholder="Enter password" required
               style={{padding:'10px 12px',fontSize:14,width:240,marginRight:8}} />
        <button type="submit" style={{padding:'10px 14px',fontSize:14}}>Enter</button>
        <div id="msg" style={{marginTop:10,fontSize:13,color:'#6b7280'}}>Protected area</div>
      </form>

      {/* inline script to post JSON */}
      <script dangerouslySetInnerHTML={{__html: `
        const f = document.getElementById('login');
        const msg = document.getElementById('msg');
        f.addEventListener('submit', async (e) => {
          e.preventDefault();
          msg.textContent = 'Checking…';
          try {
            const res = await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password: document.getElementById('pwd').value })
            });
            if (!res.ok) { msg.textContent = 'Wrong password'; msg.style.color = '#ef4444'; return; }
            location.href = '/';
          } catch {
            msg.textContent = 'Network error'; msg.style.color = '#ef4444';
          }
        });
      `}} />
    </main>
  );
}
