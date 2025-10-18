const books = [
  { title: "Belajar HTML Dasar", link: "https://www.w3schools.com/html/", category: "Pemrograman", rating: 4 },
  { title: "Pemrograman JavaScript Modern", link: "https://javascript.info/", category: "Pemrograman", rating: 5 },
  { title: "Dasar-dasar Python", link: "https://www.learnpython.org/", category: "Pemrograman", rating: 5 },
  { title: "AI untuk Pemula", link: "https://www.ibm.com/topics/ai", category: "Teknologi", rating: 5 },
  { title: "Laskar Pelangi", link: "https://id.wikipedia.org/wiki/Laskar_Pelangi", category: "Novel", rating: 4 }
];

const bookList = document.getElementById("bookList");
const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-btn");
const favoritesBtn = document.getElementById("showFavorites");
const toggleDarkMode = document.getElementById("toggleDarkMode");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let darkMode = localStorage.getItem("darkMode") === "true";

function renderBooks(list) {
  bookList.innerHTML = "";
  list.forEach(b => {
    const li = document.createElement("li");
    li.className = "book-item";
    const isFav = favorites.includes(b.title);
    li.innerHTML = `
      <a href="${b.link}" target="_blank">${b.title}</a>
      <button class="fav-btn" data-title="${b.title}">${isFav ? "❤️" : "🤍"}</button>
      <p>Kategori: ${b.category} | Rating: ⭐${b.rating}</p>
    `;
    bookList.appendChild(li);
  });
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

function toggleFavorite(title) {
  if (favorites.includes(title)) {
    favorites = favorites.filter(f => f !== title);
  } else {
    favorites.push(title);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  filterBooks(document.querySelector(".filter-btn.active").dataset.category);
}

bookList.addEventListener("click", e => {
  if (e.target.classList.contains("fav-btn")) {
    toggleFavorite(e.target.dataset.title);
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filterBooks(btn.dataset.category);
  });
});

favoritesBtn.addEventListener("click", () => {
  const favBooks = books.filter(b => favorites.includes(b.title));
  renderBooks(favBooks);
});

searchInput.addEventListener("input", () => {
  const activeCategory = document.querySelector(".filter-btn.active").dataset.category;
  filterBooks(activeCategory);
});

// --- DARK MODE ---
function updateDarkButton() {
  toggleDarkMode.textContent = darkMode ? "☀️ Light" : "🌙 Dark";
}

// === DARK MODE SWITCH ===
const darkSwitch = document.getElementById("toggle-dark");

// set awal dari localStorage
let darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
document.body.classList.toggle("dark", darkMode);
darkSwitch.checked = darkMode;

// kalau diklik
darkSwitch.addEventListener("change", () => {
  darkMode = darkSwitch.checked;
  document.body.classList.toggle("dark", darkMode);
  localStorage.setItem("darkMode", darkMode);
});


document.body.classList.toggle("dark", darkMode);
updateDarkButton(); // << tambahkan ini agar label awal sesuai mode
renderBooks(books);


// fallback: jika script tidak termuat di vercel
if (!document.querySelector('script[src*="script.js"]')) {
  const s = document.createElement("script");
  s.src = "./script.js";
  document.body.appendChild(s);
                     }
      
