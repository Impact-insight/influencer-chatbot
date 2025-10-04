// pages/index.js
const dashboardHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>IMF Europe Mentions Dashboard</title>
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
    .toolbar-right{display:flex;gap:8px;align-items:center}
    .control-group{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .btn{padding:8px 12px;border-radius:6px;border:1px solid var(--border);background:#fff;color:var(--text-primary);font-size:13px;font-weight:500;cursor:pointer;transition:.15s}
    .btn:hover{background:var(--bg-primary);border-color:var(--accent-primary)}
    .btn:disabled{opacity:.6;cursor:not-allowed}
    .file-input{position:absolute;left:-9999px}
    select,input[type="text"],input[type="search"]{padding:8px 10px;border-radius:6px;border:1px solid var(--border);background:#fff;color:var(--text-primary);font-size:13px;transition:.15s}
    select:focus,input:focus{outline:none;border-color:var(--accent-primary);box-shadow:0 0 0 3px rgb(0 76 151 / 0.15)}
    .status{font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:8px}
    .main-content{padding:20px}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:20px}
    .card{background:#fff;border-radius:12px;box-shadow:var(--shadow-md);padding:20px;border:1px solid transparent;transition:.2s}
    .card:hover{transform:translateY(-2px);box-shadow:var(--shadow-lg);border-color:var(--border)}
    .card-header{display:flex;align-items:flex-start;gap:12px;margin-bottom:16px}
    .avatar{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--accent-primary),var(--accent-secondary));display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:16px;flex-shrink:0}
    .card-meta{min-width:0;flex:1}
    .card-name{font-weight:600;font-size:16px;margin-bottom:2px}
    .card-role{font-size:13px;color:var(--text-secondary);margin-bottom:2px}
    .card-date{font-size:12px;color:var(--text-muted)}
    .card-quote{background:var(--bg-primary);border-left:3px solid var(--accent-primary);padding:12px 16px;margin:16px 0;border-radius:0 6px 6px 0;font-style:italic;color:var(--text-secondary);line-height:1.5}
    .card-context{font-size:13px;color:var(--text-secondary);background:var(--bg-primary);padding:10px 12px;border-radius:6px;margin-bottom:16px}
    .card-badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}
    .badge{display:inline-flex;align-items:center;height:24px;padding:0 8px;border-radius:10px;font-size:11px;font-weight:500;cursor:pointer;transition:.15s;border:1px solid;white-space:nowrap}
    .badge:hover{transform:translateY(-1px);box-shadow:var(--shadow-sm)}
    .badge.tone-supportive{background:#dcfce7;color:#166534;border-color:#bbf7d0}
    .badge.tone-critical{background:#fee2e2;color:#991b1b;border-color:#fecaca}
    .badge.tone-neutral{background:#fef3c7;color:#92400e;border-color:#fde68a}
    .badge.topic{background:#f1f5f9;color:var(--text-secondary);border-color:var(--border)}
    .badge.topic:hover{background:var(--accent-primary);color:#fff;border-color:var(--accent-primary)}
    .card-footer{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .card-footer a{font-size:12px;color:var(--accent-primary);text-decoration:none;font-weight:500}
    .card-footer a:hover{text-decoration:underline}
    .card-footer .separator{color:var(--text-muted);font-size:12px}
    .empty-state{text-align:center;padding:60px 20px;color:var(--text-muted);grid-column:1 / -1}
    .empty-state h3{margin:0 0 8px;color:var(--text-secondary)}
    @media (max-width:768px){
      .toolbar-grid{grid-template-columns:1fr;gap:12px}
      .toolbar-left{flex-direction:column;align-items:stretch;gap:12px}
      .control-group{justify-content:space-between}
      .grid{grid-template-columns:1fr}
      .main-content{padding:16px}
    }
  </style>
</head>
<body>
  <header class="header">
    <h1>IMF in Europe: Who Said What</h1>
    <p>Tracking quotes and references from European leaders and commentators.</p>
  </header>

  <div class="toolbar">
    <div class="toolbar-grid">
      <div class="toolbar-left">
        <div class="control-group">
          <label class="btn" for="csvFile">📁 Upload CSV</label>
          <input type="file" id="csvFile" class="file-input" accept=".csv" onchange="handleFileUpload(this)" />
          <!-- Removed: Add Test Data -->
          <button id="downloadBtn" class="btn" onclick="downloadCSV()" disabled>⬇️ Download CSV</button>
          <!-- Removed: Download Report -->
          <button class="btn" onclick="clearAllData()">🗑️ Clear Data</button>
        </div>

        <div class="control-group">
          <label><strong>Tone:</strong></label>
          <button class="btn tone-btn active" data-tone="All" onclick="setToneFilter('All', this)">All</button>
          <button class="btn tone-btn" data-tone="Supportive" onclick="setToneFilter('Supportive', this)">Supportive</button>
          <button class="btn tone-btn" data-tone="Critical" onclick="setToneFilter('Critical', this)">Critical</button>
          <button class="btn tone-btn" data-tone="Neutral" onclick="setToneFilter('Neutral', this)">Neutral</button>
        </div>

        <!-- Removed: Topic filter (and its "All Topics" option) -->
        <!-- Removed: Institution filter -->
        <div class="control-group">
          <input id="searchBox" type="search" placeholder="Search names, quotes, context..." style="width:250px" oninput="filterData()"/>
          <button class="btn" onclick="clearFilters()">Clear Filters</button>
        </div>
      </div>

      <div class="toolbar-right">
        <div class="status">
          <span id="status">Loading…</span>
          <span id="count"></span>
        </div>
      </div>
    </div>
  </div>

  <main class="main-content">
    <div class="grid" id="cards">
      <div class="empty-state">
        <h3>No data loaded</h3>
        <p>Waiting for Google Sheets… or upload a CSV.</p>
      </div>
    </div>
  </main>

<script>
// -------------------- Global state --------------------
var allData = [];
var filteredData = [];
var currentFilters = { tone: 'All', topic: '', institution: '', search: '' };

// -------------------- Helpers --------------------
function escapeHtml(t){ if(!t) return ''; var d=document.createElement('div'); d.textContent=t; return d.innerHTML; }
function getInitials(name){ if(!name) return '?'; var p=name.trim().split(' '); return (p[0]?.[0]||'')+(p[p.length-1]?.[0]||''); }
function updateStatus(m){ var el=document.getElementById('status'); if(el) el.textContent=m; }
function updateCount(){ var el=document.getElementById('count'); if(el) el.textContent = filteredData.length + ' record' + (filteredData.length!==1?'s':''); }
function updateButtonStates(){ var has=allData.length>0; var d=document.getElementById('downloadBtn'), p=document.getElementById('pdfBtn'); if(d) d.disabled=!has; if(p) p.disabled=!has; }

// -------------------- Transform & parse --------------------
function transformRecord(r){ return {
  person:r.person||r.Person||'',
  role:buildRole(r),
  institution:r.institution||r.Institution||'',
  date:r.date_iso||r.date||r.Date||'',
  quote:r.quote_verbatim||r.quote||r.Quote||'',
  tone:normalizeTone(r.tone_toward_imf||r.tone||r.Tone||''),
  topics:splitTopics(r.topic_tags||r.topics||r.Topics||''),
  context:r.context||r.Context||r.context_summary||'',
  source:r.venue_link||r.source_url||r.Source||'',
  secondary:r.secondary_links||''
};}
function buildRole(r){ var parts=[]; if(r.role||r.Role) parts.push(r.role||r.Role); if(r.institution_country) parts.push(r.institution_country); return parts.join(', '); }
function normalizeTone(t){ var x=String(t).toLowerCase(); if(x.includes('sup')||x.includes('pos')) return 'Supportive'; if(x.includes('cri')||x.includes('neg')) return 'Critical'; return 'Neutral'; }
function splitTopics(s){ if(!s) return []; return s.split(/[|,;]+/).map(t=>t.trim()).filter(Boolean); }

// -------------------- CSV load & manual upload --------------------
function handleFileUpload(input){
  if(!input.files||!input.files[0]) return;
  var file=input.files[0];
  if(!file.name.toLowerCase().endsWith('.csv')){ alert('Please select a CSV file'); return; }
  updateStatus('Reading file: '+file.name);
  var reader=new FileReader();
  reader.onload=function(e){
    try{
      var data=parseCSV(e.target.result);
      if(!data.length){ updateStatus('No data in CSV'); return; }
      allData=data.map(transformRecord);
      saveToStorage(); populateFilters(); filterData(); updateButtonStates();
      updateStatus('Loaded '+allData.length+' records from '+file.name);
    }catch(err){ updateStatus('Error reading CSV: '+err.message); }
  };
  reader.readAsText(file);
}

function parseCSV(text){
  var lines=text.trim().split('\\n'); if(lines.length<2) return [];
  var headers=parseCSVLine(lines[0]); var data=[];
  for(var i=1;i<lines.length;i++){ if(lines[i].trim()){ var vals=parseCSVLine(lines[i]); var rec={}; for(var j=0;j<headers.length;j++){ rec[headers[j]]=vals[j]||''; } data.push(rec); } }
  return data;
}
function parseCSVLine(line){
  var out=[], cur='', inQ=false;
  for(var i=0;i<line.length;i++){ var ch=line[i];
    if(ch=='"'){ inQ=!inQ; }
    else if(ch==',' && !inQ){ out.push(cur.trim()); cur=''; }
    else { cur+=ch; }
  }
  out.push(cur.trim()); return out;
}

// -------------------- Filters --------------------
function populateFilters(){
  // Topic filter removed in UI: keep code resilient by no-op if element isn't present.
  var tSel=document.getElementById('topicSelect');
  if (tSel) {
    var allTopics=[]; allData.forEach(r=>{ allTopics=allTopics.concat(r.topics||[]); });
    var uniqT=allTopics.filter((t,i)=>allTopics.indexOf(t)===i).sort();
    var cur=tSel.value; tSel.innerHTML=''; // no default "All Topics" requested
    uniqT.forEach(t=>{ var o=document.createElement('option'); o.value=t; o.textContent=t; tSel.appendChild(o); });
    tSel.value=cur;
  }

  // Institution filter removed from UI — gracefully skip if not present.
  var iSel=document.getElementById('institutionSelect');
  if (iSel) {
    var allInst=allData.map(r=>r.institution).filter(Boolean);
    var uniqI=allInst.filter((x,i)=>allInst.indexOf(x)===i).sort();
    var cur2=iSel.value; iSel.innerHTML='';
    uniqI.forEach(i=>{ var o=document.createElement('option'); o.value=i; o.textContent=i; iSel.appendChild(o); });
    iSel.value=cur2;
  }
}
function setToneFilter(tone,btn){ currentFilters.tone=tone; document.querySelectorAll('.tone-btn').forEach(b=>b.classList.remove('active')); if(btn) btn.classList.add('active'); filterData(); }
function filterData(){
  var tSel=document.getElementById('topicSelect');
  var iSel=document.getElementById('institutionSelect');
  var sBox=document.getElementById('searchBox');
  if(tSel) currentFilters.topic=tSel.value; else currentFilters.topic='';
  if(iSel) currentFilters.institution=iSel.value; else currentFilters.institution='';
  if(sBox) currentFilters.search=sBox.value.toLowerCase();
  filteredData=allData.filter(r=>{
    var toneOk=currentFilters.tone==='All'||r.tone===currentFilters.tone;
    var topicOk=!currentFilters.topic||(r.topics&&r.topics.includes(currentFilters.topic));
    var instOk=!currentFilters.institution||r.institution===currentFilters.institution;
    var searchOk=true;
    if(currentFilters.search){ var txt=[r.person,r.role,r.institution,r.quote,r.context].join(' ').toLowerCase(); searchOk=txt.includes(currentFilters.search); }
    return toneOk&&topicOk&&instOk&&searchOk;
  }).sort((a,b)=>new Date(b.date||'1900-01-01')-new Date(a.date||'1900-01-01'));
  renderCards(); updateCount();
}
function clearFilters(){ currentFilters={tone:'All',topic:'',institution:'',search:''};
  setToneFilter('All',document.querySelector('.tone-btn[data-tone="All"]'));
  var tSel=document.getElementById('topicSelect'),iSel=document.getElementById('institutionSelect'),sBox=document.getElementById('searchBox');
  if(tSel) tSel.value=''; if(iSel) iSel.value=''; if(sBox) sBox.value=''; filterData();
}

// -------------------- Render --------------------
function renderCards(){
  var c=document.getElementById('cards'); if(!c) return;
  if(!filteredData.length){ c.innerHTML='<div class="empty-state"><h3>No data matches your filters</h3><p>Try adjusting filters or add data.</p></div>'; return; }
  var html=''; filteredData.forEach(r=>{ html+=renderCard(r); }); c.innerHTML=html;
}
function renderCard(r){
  var initials=getInitials(r.person), toneClass='tone-'+r.tone.toLowerCase();
  var topicsHtml=(r.topics||[]).slice(0,6).map(t=>'<span class="badge topic" onclick="filterByTopic(\\''+escapeHtml(t)+'\\')">'+escapeHtml(t)+'</span>').join('');
  var sec=(r.secondary||'').split(/[|,]/).filter(Boolean);
  var linksHtml=sec.map((l,i)=>'<span class="separator">•</span><a href="'+escapeHtml(l.trim())+'" target="_blank" rel="noopener">Link '+(i+1)+' ↗</a>').join('');
  return '<article class="card">'+
    '<div class="card-header"><div class="avatar">'+initials+'</div>'+
      '<div class="card-meta"><div class="card-name">'+escapeHtml(r.person)+'</div>'+
      '<div class="card-role">'+escapeHtml(r.role)+'</div>'+
      '<div class="card-date">'+escapeHtml(formatDate(r.date))+'</div></div></div>'+
    '<div class="card-quote">"'+escapeHtml(r.quote)+'"</div>'+
    (r.context?'<div class="card-context"><strong>Context:</strong> '+escapeHtml(r.context)+'</div>':'')+
    '<div class="card-badges"><span class="badge '+toneClass+'" onclick="filterByTone(\\''+r.tone+'\\')">'+r.tone+'</span>'+topicsHtml+'</div>'+
    '<div class="card-footer">'+(r.source?'<a href="'+escapeHtml(r.source)+'" target="_blank" rel="noopener">Source ↗</a>':'')+linksHtml+'</div>'+
  '</article>';
}
function formatDate(s){ if(!s) return ''; try{ return new Date(s).toLocaleDateString(); }catch(e){ return s; } }
function filterByTopic(t){ var sel=document.getElementById('topicSelect'); if(sel){ sel.value=t; filterData(); } }
function filterByTone(t){ setToneFilter(t,document.querySelector('.tone-btn[data-tone="'+t+'"]')); }

// -------------------- Export & storage --------------------
function escapeCSV(x){ if(!x) return ''; x=String(x); if(x.includes(',')||x.includes('"')||x.includes('\\n')) return '"'+x.replace(/"/g,'""')+'"'; return x; }
function downloadFile(content,filename,type){ var blob=new Blob([content],{type}); var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }
function downloadCSV(){
  if(!allData.length){ alert('No data to download'); return; }
  var headers=['Person','Role','Institution','Date','Quote','Tone','Topics','Context','Source'];
  var csv=headers.join(',')+'\\n';
  allData.forEach(r=>{ var row=[escapeCSV(r.person),escapeCSV(r.role),escapeCSV(r.institution),escapeCSV(r.date),escapeCSV(r.quote),escapeCSV(r.tone),escapeCSV((r.topics||[]).join('|')),escapeCSV(r.context),escapeCSV(r.source)]; csv+=row.join(',')+'\\n'; });
  downloadFile(csv,'imf_mentions_'+new Date().toISOString().split('T')[0]+'.csv','text/csv'); updateStatus('CSV downloaded with '+allData.length+' records');
}
function saveToStorage(){ try{ localStorage.setItem('imf_dashboard_data', JSON.stringify(allData)); }catch(e){} }
function loadFromStorage(){ try{ var s=localStorage.getItem('imf_dashboard_data'); if(s){ var d=JSON.parse(s); if(Array.isArray(d)&&d.length){ allData=d; return true; } } }catch(e){} return false; }
function clearStorage(){ try{ localStorage.removeItem('imf_dashboard_data'); }catch(e){} }
function clearAllData(){ allData=[]; filteredData=[]; clearStorage(); currentFilters={tone:'All',topic:'',institution:'',search:''};
  var tSel=document.getElementById('topicSelect'),iSel=document.getElementById('institutionSelect'),sBox=document.getElementById('searchBox'),f=document.getElementById('csvFile');
  if(tSel) tSel.innerHTML=''; if(iSel) iSel.innerHTML='';
  if(sBox) sBox.value=''; if(f) f.value=''; document.querySelectorAll('.tone-btn').forEach(b=>b.classList.remove('active'));
  var allBtn=document.querySelector('.tone-btn[data-tone="All"]'); if(allBtn) allBtn.classList.add('active');
  renderCards(); updateButtonStates(); updateCount(); updateStatus('✅ All data has been cleared');
}

// -------------------- Google Sheets preload --------------------
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRHNDzCHbLAlNADPMUCL5H_8JOSXKW4Mt7AFxldyPLMx-oKI-pILTbpLIn_zhWMRSFN9arUjJ_nzQec/pub?gid=0&single=true&output=csv";

async function preloadFromGoogleSheet(){
  try{
    const bust = new Date().toISOString().slice(0,7); // YYYY-MM cache buster
    const res = await fetch(CSV_URL + "&v=" + encodeURIComponent(bust));
    if(!res.ok) throw new Error("HTTP " + res.status);
    const csvText = await res.text();
    const rows = parseCSV(csvText);
    if(!rows.length) throw new Error("CSV has no rows");
    allData = rows.map(transformRecord);
    saveToStorage(); populateFilters(); filterData(); updateButtonStates(); updateStatus("Loaded latest data from Google Sheets");
    return true;
  }catch(e){
    updateStatus("Couldn’t load Google Sheet (" + e.message + "). Showing last saved data if available.");
    return false;
  }
}

// -------------------- Init --------------------
async function initialize(){
  const ok = await preloadFromGoogleSheet();
  if(ok) return;
  if(loadFromStorage()){
    populateFilters(); filterData(); updateButtonStates();
    updateStatus('Loaded '+allData.length+' records from previous session');
  } else {
    updateStatus('Ready - Upload CSV or click Clear Data');
  }
}
if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', initialize); } else { initialize(); }
</script>
</body>
</html>`;

export default function Home() {
  return (
    <main style={{ height: '100vh', margin: 0, padding: 0 }}>
      <iframe
        title="IMF Europe Mentions Dashboard"
        srcDoc={dashboardHTML}
        style={{ border: 0, width: '100%', height: '100%' }}
        sandbox="allow-scripts allow-same-origin allow-downloads allow-popups"
      />
    </main>
  );
}
