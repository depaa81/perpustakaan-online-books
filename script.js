async function sha256Hex(str) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(str));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2,'0')).join('');
}

(async function setupDefault() {
  if(!localStorage.getItem('adminHash')){
    const h = await sha256Hex('admin123');
    localStorage.setItem('adminHash', h);
  }
  if(!localStorage.getItem('books')){
    localStorage.setItem('books', JSON.stringify([]));
  }
})();

const loginForm = document.getElementById('loginForm');
if(loginForm){
  loginForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const hashed = await sha256Hex(password);
    const adminHash = localStorage.getItem('adminHash');
    if(username === 'admin' && hashed === adminHash){
      document.getElementById('loginBox').classList.add('hidden');
      document.getElementById('adminPage').classList.remove('hidden');
      renderBooks('admin');
    } else {
      alert('Username atau password salah.');
    }
  });
}

function addBook(){
  const title = document.getElementById('bookTitle').value.trim();
  const link = document.getElementById('bookLink').value.trim();
  if(!title || !link) return alert('Lengkapi judul dan link!');
  const books = JSON.parse(localStorage.getItem('books') || '[]');
  books.push({title, link});
  localStorage.setItem('books', JSON.stringify(books));
  document.getElementById('bookTitle').value = '';
  document.getElementById('bookLink').value = '';
  renderBooks('admin');
}

function deleteBook(index){
  const books = JSON.parse(localStorage.getItem('books') || '[]');
  if(confirm(`Hapus buku "${books[index].title}"?`)){
    books.splice(index, 1);
    localStorage.setItem('books', JSON.stringify(books));
    renderBooks('admin');
  }
}

function renderBooks(role){
  const books = JSON.parse(localStorage.getItem('books') || '[]');
  const target = document.getElementById(role === 'admin' ? 'adminBookList' : 'userBookList');
  if(!target) return;
  target.innerHTML = '';
  if(books.length === 0){
    target.innerHTML = '<p>Tidak ada buku tersedia.</p>';
    return;
  }
  books.forEach((b, i)=>{
    const div = document.createElement('div');
    div.className = 'book-item';
    div.innerHTML = `
      <div>
        <b>${i+1}. ${b.title}</b><br>
        <a href="${b.link}" target="_blank">Buka Buku</a>
      </div>
      ${role === 'admin' ? `<button onclick="deleteBook(${i})">❌ Hapus</button>` : ''}
    `;
    target.appendChild(div);
  });
}

function logout(){
  window.location.href = 'index.html';
}

async function changePassword(){
  const oldPass = document.getElementById('oldPass').value;
  const newPass = document.getElementById('newPass').value;
  const confirmPass = document.getElementById('confirmPass').value;

  if(!oldPass || !newPass || !confirmPass){
    alert('Harap isi semua kolom.');
    return;
  }

  const oldHash = await sha256Hex(oldPass);
  const currentHash = localStorage.getItem('adminHash');

  if(oldHash !== currentHash){
    alert('Password lama salah!');
    return;
  }

  if(newPass !== confirmPass){
    alert('Konfirmasi password baru tidak cocok!');
    return;
  }

  const newHash = await sha256Hex(newPass);
  localStorage.setItem('adminHash', newHash);
  alert('Password berhasil diganti!');
  document.getElementById('oldPass').value = '';
  document.getElementById('newPass').value = '';
  document.getElementById('confirmPass').value = '';
}