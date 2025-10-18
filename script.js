// === DATA BUKU ===
const books = [
  { title: "Belajar HTML Dasar", category: "Teknologi", link: "https://www.w3schools.com/html/" },
  { title: "Panduan CSS Modern", category: "Teknologi", link: "https://www.w3schools.com/css/" },
  { title: "Filosofi Kopi", category: "Novel", link: "https://www.goodreads.com/book/show/350064" },
  { title: "Sejarah Dunia Singkat", category: "Non-Fiksi", link: "https://example.com/sejarah" },
  { title: "Belajar JavaScript", category: "Teknologi", link: "https://www.javascript.info/" },
];

// === ELEMENT ===
const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("search");
const filterBtns = document.querySelectorAll(".filter-btn");
const favoritesBtn = document.getElementById("favorites-btn");
const darkSwitch = document.getElementById("toggle-dark");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
document.body.classList.toggle("dark", darkMode);
darkSwitch.checked = darkMode;

// === RENDER BUKU ===
function renderBooks(list) {
  bookList.innerHTML = list.map(book => `
    <div class="book-card">
      <h3>${book.title}</h3>
      <p>Kategori: ${book.category}</p>
      <a href="${book.link}" target="_blank">Baca Buku</a>
      <button class="fav-btn ${favorites.includes(book.title) ? "active" : ""}" data-title="${book.title}">❤️</button>
    </div>
  `).join("");
}

renderBooks(books);

// === FILTER BUKU ===
function filterBooks(category, keyword = "") {
  const filtered = books.filter(b => {
    const matchCat = category === "all" || b.category === category;
    const matchSearch = b.title.toLowerCase().includes(keyword.toLowerCase());
    return matchCat && matchSearch;
  });
  renderBooks(filtered);
}

// === FAVORIT ===
function toggleFavorite(title) {
  if (favorites.includes(title)) {
    favorites = favorites.filter(f => f !== title);
  } else {
    favorites.push(title);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderBooks(books);
}

// === EVENT LISTENER ===
bookList.addEventListener("click", e => {
  if (e.target.classList.contains("fav-btn")) {
    toggleFavorite(e.target.dataset.title);
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filterBooks(btn.dataset.category, searchInput.value);
  });
});

favoritesBtn.addEventListener("click", () => {
  const favBooks = books.filter(b => favorites.includes(b.title));
  renderBooks(favBooks);
});

searchInput.addEventListener("input", () => {
  const activeCat = document.querySelector(".filter-btn.active").dataset.category;
  filterBooks(activeCat, searchInput.value);
});

// === DARK MODE ===
darkSwitch.addEventListener("change", () => {
  darkMode = darkSwitch.checked;
  document.body.classList.toggle("dark", darkMode);
  localStorage.setItem("darkMode", darkMode);
});
