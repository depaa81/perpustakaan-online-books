let books = [
  {
    title: "Sejarah Dunia Singkat",
    category: "Non-Fiksi",
    link: "https://example.com/sejarah-dunia",
    favorite: false
  },
  {
    title: "Pemrograman Modern",
    category: "Teknologi",
    link: "https://example.com/teknologi",
    favorite: false
  },
  {
    title: "Laskar Pelangi",
    category: "Novel",
    link: "https://example.com/novel",
    favorite: false
  }
];

if (localStorage.getItem("books")) {
  books = JSON.parse(localStorage.getItem("books"));
}

const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-btn");
const favoritesBtn = document.getElementById("favoritesBtn");
const toggleDarkMode = document.getElementById("toggleDarkMode");

let darkMode = localStorage.getItem("darkMode") === "true";

if (darkMode) {
  document.body.classList.add("dark");
  toggleDarkMode.innerHTML = '<span class="icon">☀️</span>';
}

function saveBooks() {
  localStorage.setItem("books", JSON.stringify(books));
}

function renderBooks(filteredBooks = books) {
  bookList.innerHTML = "";

  filteredBooks.forEach((book, index) => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <h3>${book.title}</h3>
      <p>Kategori: ${book.category}</p>
      <a href="${book.link}" target="_blank">Baca Buku</a>
      <button class="fav-btn ${book.favorite ? "active" : ""}" onclick="toggleFavorite(${index})">❤️</button>
    `;
    bookList.appendChild(card);
  });
}

function toggleFavorite(index) {
  books[index].favorite = !books[index].favorite;
  saveBooks();
  renderBooks();
}

function filterBooks(category) {
  const keyword = searchInput.value.toLowerCase();
  const filtered = books.filter(b => {
    const matchCategory = category === "all" || b.category === category;
    const matchSearch = b.title.toLowerCase().includes(keyword);
    return matchCategory && matchSearch;
  });
  renderBooks(filtered);
}

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filterBooks(btn.dataset.category);
  });
});

favoritesBtn.addEventListener("click", () => {
  const favBooks = books.filter(b => b.favorite);
  renderBooks(favBooks);
});

searchInput.addEventListener("input", () => {
  const activeCategory = document.querySelector(".filter-btn.active").dataset.category;
  filterBooks(activeCategory);
});

toggleDarkMode.addEventListener("click", () => {
  darkMode = !darkMode;
  document.body.classList.toggle("dark", darkMode);
  toggleDarkMode.innerHTML = darkMode ? '<span class="icon">☀️</span>' : '<span class="icon">🌙</span>';
  localStorage.setItem("darkMode", darkMode);
});

renderBooks();
              
