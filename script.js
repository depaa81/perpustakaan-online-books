const books = [
  { title: "Belajar HTML Dasar", link: "https://www.w3schools.com/html/", category: "Pemrograman", rating: 4 },
  { title: "Pemrograman JavaScript Modern", link: "https://javascript.info/", category: "Pemrograman", rating: 5 },
  { title: "Dasar-dasar Python", link: "https://www.learnpython.org/", category: "Pemrograman", rating: 5 },
  { title: "Kuasai React JS", link: "https://react.dev/learn", category: "Teknologi", rating: 4 },
  { title: "Belajar Git dan GitHub", link: "https://www.atlassian.com/git/tutorials", category: "Teknologi", rating: 3 },
  { title: "Prinsip Desain Modern", link: "https://uxdesign.cc", category: "Desain", rating: 4 },
  { title: "Bisnis Digital Era AI", link: "#", category: "Bisnis", rating: 4 },
  { title: "Eksperimen Fisika Sederhana", link: "#", category: "Sains", rating: 3 }
];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let darkMode = localStorage.getItem("darkMode") === "true";

function renderBooks(list) {
  const bookList = document.getElementById("bookList");
  bookList.innerHTML = "";
  list.forEach((book, index) => {
    const isFav = favorites.some(f => f.title === book.title);
    const li = document.createElement("li");
    li.className = "py-3 flex justify-between items-center";
    li.innerHTML = \`
      <div>
        <a href="\${book.link}" target="_blank" class="font-medium hover:underline">\${book.title}</a>
        <div class="text-sm opacity-80">\${book.category} • ⭐ \${book.rating}</div>
      </div>
      <button class="fav-btn \${isFav ? 'favorite' : 'text-gray-400 hover:text-yellow-400'}" data-index="\${index}">★</button>
    \`;
    bookList.appendChild(li);
  });
  document.querySelectorAll(".fav-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const i = e.target.getAttribute("data-index");
      toggleFavorite(list[i]);
    });
  });
}

function renderFavorites() {
  const favList = document.getElementById("favoriteList");
  favList.innerHTML = favorites.length ? "" : `<p class='opacity-70'>Belum ada buku favorit.</p>`;
  favorites.forEach(book => {
    const li = document.createElement("li");
    li.className = "py-3 flex justify-between items-center";
    li.innerHTML = \`
      <div>
        <a href="\${book.link}" target="_blank" class="font-medium hover:underline">\${book.title}</a>
        <div class="text-sm opacity-80">\${book.category} • ⭐ \${book.rating}</div>
      </div>
      <button class="text-red-500 hover:text-red-700" onclick="removeFavorite('\${book.title}')">Hapus</button>
    \`;
    favList.appendChild(li);
  });
}

function toggleFavorite(book) {
  const index = favorites.findIndex(f => f.title === book.title);
  if (index === -1) favorites.push(book);
  else favorites.splice(index, 1);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderBooks(filterBooks());
  renderFavorites();
}

function removeFavorite(title) {
  favorites = favorites.filter(f => f.title !== title);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderBooks(filterBooks());
  renderFavorites();
}

function filterBooks() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const sort = document.getElementById("sortFilter").value;

  let filtered = books.filter(b =>
    b.title.toLowerCase().includes(search) &&
    (category === "" || b.category === category)
  );

  if (sort === "az") filtered.sort((a,b)=>a.title.localeCompare(b.title));
  if (sort === "za") filtered.sort((a,b)=>b.title.localeCompare(a.title));
  if (sort === "rating") filtered.sort((a,b)=>b.rating - a.rating);
  if (sort === "favorite") filtered.sort((a,b)=> (favorites.some(f=>f.title===b.title)?1:0) - (favorites.some(f=>f.title===a.title)?1:0));

  return filtered;
}

document.getElementById("searchInput").addEventListener("input", ()=>renderBooks(filterBooks()));
document.getElementById("categoryFilter").addEventListener("change", ()=>renderBooks(filterBooks()));
document.getElementById("sortFilter").addEventListener("change", ()=>renderBooks(filterBooks()));

const themeBtn = document.getElementById("themeToggle");
function applyTheme() {
  if (darkMode) {
    document.body.classList.add("dark-mode");
    themeBtn.textContent = "☀️ Light";
  } else {
    document.body.classList.remove("dark-mode");
    themeBtn.textContent = "🌙 Dark";
  }
}
themeBtn.addEventListener("click", ()=>{
  darkMode = !darkMode;
  localStorage.setItem("darkMode", darkMode);
  applyTheme();
});

document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.addEventListener("click", e=>{
    document.querySelectorAll("main").forEach(m=>m.classList.add("hidden"));
    document.getElementById(\`page-\${e.target.dataset.page}\`).classList.remove("hidden");
    document.querySelectorAll(".nav-btn").forEach(n=>n.classList.remove("text-indigo-600","font-semibold"));
    e.target.classList.add("text-indigo-600","font-semibold");
  });
});

applyTheme();
renderBooks(books);
renderFavorites();
      
