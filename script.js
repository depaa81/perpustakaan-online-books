async function fetchBooks() {
  const res = await fetch('/api/books');
  const data = await res.json();
  return data.books || [];
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2500);
}

document.addEventListener('DOMContentLoaded', async () => {
  const loginBtn = document.getElementById('loginBtn');
  const adminPanel = document.getElementById('adminPanel');
  const bookList = document.getElementById('bookList');
  const addBookBtn = document.getElementById('addBookBtn');
  const bookListUser = document.getElementById('bookListUser');

  if (bookListUser) {
    const books = await fetchBooks();
    bookListUser.innerHTML = books.map(b => 
      `<li><a href="${b.link}" target="_blank">${b.title}</a></li>`
    ).join('');
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const user = document.getElementById('username').value;
      const pass = document.getElementById('password').value;
      if (user === 'admin' && pass === 'admin123') {
        document.getElementById('loginForm').classList.add('hidden');
        adminPanel.classList.remove('hidden');
        loadAdminBooks();
      } else {
        alert('Username atau password salah!');
      }
    });
  }

  async function loadAdminBooks() {
    const books = await fetchBooks();
    bookList.innerHTML = books.map((b, i) => 
      `<li>${b.title} - <a href="${b.link}" target="_blank">Baca</a>
       <button onclick="deleteBook(${i})">Hapus</button></li>`
    ).join('');
  }

  if (addBookBtn) {
    addBookBtn.addEventListener('click', async () => {
      const title = document.getElementById('bookTitle').value;
      const link = document.getElementById('bookLink').value;
      if (!title || !link) return alert('Lengkapi data buku!');
      await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, link })
      });
      showToast('Buku berhasil ditambahkan!');
      loadAdminBooks();
    });
  }
});

async function deleteBook(index) {
  await fetch(`/api/books?index=${index}`, { method: 'DELETE' });
  showToast('Buku dihapus!');
  location.reload();
}
