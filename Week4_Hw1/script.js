// Kullanıcı verilerini API'den çeker ve localStorage ile yönetir
const apiURL = "https://jsonplaceholder.typicode.com/users";
const container = document.querySelector(".ins-api-users");
const STORAGE_KEY = "usersData";
const ONE_DAY = 24 * 60 * 60 * 1000; // 1 gün

// Sayfa yüklenince çalışacak ana fonksiyon
document.addEventListener("DOMContentLoaded", () => {
  // CSS ekleyelim
  addStyles();

  // localStorage'ta veri var mı ve süresi dolmamış mı?
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const now = new Date().getTime();

  if (stored && now - stored.timestamp < ONE_DAY) {
    renderUsers(stored.data);
  } else {
    fetchUsers();
  }
});

// CSS'i dinamik olarak ekler
function addStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .user-card {
      border: 1px solid #ccc;
      background: #f9f9f9;
      padding: 10px;
      margin: 10px 0;
      border-radius: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .user-info {
      max-width: 80%;
    }
    .delete-btn {
      background: #ff4d4d;
      border: none;
      color: white;
      padding: 5px 10px;
      cursor: pointer;
      border-radius: 3px;
    }
    .delete-btn:hover {
      background: #cc0000;
    }
    .error-message {
      color: red;
      font-weight: bold;
      margin: 20px 0;
    }
  `;
  document.head.appendChild(style);
}

// API'den kullanıcıları çeker (Fetch + Promise)
async function fetchUsers() {
  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error("API'ye ulaşılamadı!");
    }
    const data = await response.json();

    // localStorage'a kaydet (1 gün süreyle)
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ data: data, timestamp: new Date().getTime() })
    );

    renderUsers(data);
  } catch (error) {
    showError(error.message);
  }
}

// Kullanıcıları sayfada gösterir
function renderUsers(users) {
  container.innerHTML = ""; // Önce alanı temizle
  users.forEach((user) => {
    const card = document.createElement("div");
    card.className = "user-card";
    card.dataset.id = user.id; // Kullanıcıyı tanımak için id

    const info = document.createElement("div");
    info.className = "user-info";
    info.innerHTML = `
      <p><strong>${user.name}</strong></p>
      <p>${user.email}</p>
      <p>${user.address.street}, ${user.address.city}</p>
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Sil";

    // Silme olayı
    deleteBtn.addEventListener("click", () => deleteUser(user.id));

    card.appendChild(info);
    card.appendChild(deleteBtn);
    container.appendChild(card);
  });
}

// Kullanıcıyı siler (DOM + localStorage)
function deleteUser(id) {
  // localStorage'taki veriyi al
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!stored) return;

  const filtered = stored.data.filter((u) => u.id !== id);

  // Güncel listeyi kaydet
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ data: filtered, timestamp: stored.timestamp })
  );

  // Sayfayı güncelle
  renderUsers(filtered);
}

// Hata mesajı gösterir
function showError(message) {
  container.innerHTML = `<p class="error-message">${message}</p>`;
}
