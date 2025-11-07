// Frontend JS - works for both pages. Configure API_BASE to match where you deploy the PHP backend.
const API_BASE = "https://YOUR_BACKEND_DOMAIN/api"; // <-- Replace this after you deploy backend (instructions in README)

function el(id){return document.getElementById(id)}

// Simple helpers
function showMessage(msg, isError=true){ const m = el('message'); if(!m) return; m.textContent = msg; m.style.color = isError ? '#b00' : 'green'; setTimeout(()=>{m.textContent=''},4000) }

// Auth flows (index.html)
if(el('login-form')){
  // toggle forms
  el('show-signup').addEventListener('click', e=>{ e.preventDefault(); el('login-form').classList.add('hidden'); el('signup-form').classList.remove('hidden') })
  el('show-login').addEventListener('click', e=>{ e.preventDefault(); el('signup-form').classList.add('hidden'); el('login-form').classList.remove('hidden') })

  // signup
  el('signup-form').addEventListener('submit', async e=>{
    e.preventDefault();
    const name = el('signup-name').value.trim(), email = el('signup-email').value.trim(), password = el('signup-password').value;
    try{
      const res = await fetch(API_BASE + '/signup.php', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name,email,password})});
      const data = await res.json();
      if(data.success){
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({id:data.user_id,name:name,email}));
        window.location = '/feed.html';
      } else showMessage(data.error || 'Signup failed');
    }catch(err){ showMessage('Network error') }
  });

  // login
  el('login-form').addEventListener('submit', async e=>{
    e.preventDefault();
    const email = el('login-email').value.trim(), password = el('login-password').value;
    try{
      const res = await fetch(API_BASE + '/login.php', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password})});
      const data = await res.json();
      if(data.success){
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({id:data.user_id,name:data.name,email:data.email}));
        window.location = '/feed.html';
      } else showMessage(data.error || 'Login failed');
    }catch(err){ showMessage('Network error') }
  });
}

// Feed logic (feed.html)
if(el('post-btn')){
  const user = JSON.parse(localStorage.getItem('user')||'null');
  if(!user){ window.location = '/index.html'; }
  el('user-info').textContent = user.name;
  el('logout-btn').addEventListener('click', ()=>{ localStorage.clear(); window.location = '/index.html'; })

  async function loadFeed(){
    try{
      const res = await fetch(API_BASE + '/fetch_posts.php');
      const data = await res.json();
      if(!data.success) return;
      const feed = el('feed'); feed.innerHTML = '';
      data.posts.forEach(p=>{
        const div = document.createElement('div'); div.className = 'post card';
        div.innerHTML = `
          <div class="meta">
            <div><strong>${escapeHtml(p.name)}</strong> • <span class="muted">${escapeHtml(p.created_at)}</span></div>
            <div class="actions">
              <button class="like-btn" data-post="${p.id}">Like</button>
              <div class="like-count" id="likes-${p.id}">${p.likes}</div>
            </div>
          </div>
          <div class="content">${escapeHtml(p.content)}</div>
        `;
        feed.appendChild(div);
      });
      // attach like handlers
      document.querySelectorAll('.like-btn').forEach(btn=>{
        btn.addEventListener('click', async ()=>{
          const postId = btn.getAttribute('data-post');
          try{
            const token = localStorage.getItem('token') || '';
            const res = await fetch(API_BASE + '/like.php', {method:'POST', headers:{'Content-Type':'application/json','Authorization': token}, body: JSON.stringify({post_id:postId})});
            const d = await res.json();
            if(d.success){ document.getElementById('likes-'+postId).textContent = d.likes; }
            else alert(d.error || 'Could not like');
          }catch(e){ alert('Network error') }
        });
      });
    }catch(err){ console.error(err) }
  }

  el('post-btn').addEventListener('click', async ()=>{
    const text = el('post-text').value.trim();
    if(!text) return alert('Write something first');
    const token = localStorage.getItem('token') || '';
    try{
      const res = await fetch(API_BASE + '/add_post.php', {method:'POST', headers:{'Content-Type':'application/json','Authorization': token}, body: JSON.stringify({content:text})});
      const d = await res.json();
      if(d.success){ el('post-text').value=''; loadFeed(); } else alert(d.error || 'Could not post');
    }catch(e){ alert('Network error') }
  });

  loadFeed();
}

// small helper: escape
function escapeHtml(s){ if(!s) return ''; return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('\"','&quot;') }
