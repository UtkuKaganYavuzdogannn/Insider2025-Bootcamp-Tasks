// Değişken sabitleri tanımladım
const apiURL = "https://jsonplaceholder.typicode.com/users";
const container = document.querySelector(".ins-api-users");
const STORAGE_KEY = "usersData";
const ONE_DAY = 24 * 60 * 60 * 1000; // 1 gün bu şekilde ms cinsinden hesaplanıyormuş.

// Sayfa yüklemesi ve css eklenmesi
document.addEventListener("DOMContentLoaded", () => {
addCSS();

  // string veriyi js objesine çevirip metnin alanlarına ulaştık.
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const now = new Date().getTime();

  if (stored && now - stored.timestamp < ONE_DAY) {
    renderUsers(stored.data);
  } else {
    fetchUsers();
  }
});

// CSS append ediyorum head'e tek js dosyası için.
function addCSS() {
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

// fetch ile api isteği yaptık ve data sabitine ekledim. 
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
    // Daha açıklayıcı hata mesajı
    showError("Veri alınamadı: " + error.message);
  }
}

// Görüntülemek için render edip önce içeriği temizleyip sonra forech ile tek tek kartlara bastık.
function renderUsers(users) {
  container.innerHTML = ""; 
  users.forEach((user) => {
    const card = document.createElement("div");
    card.className = "user-card";
  // Kullanıcıyı tanımak için id
    card.dataset.id = user.id; 

    const info = document.createElement("div");
    info.className = "user-info";
    info.innerHTML = 
    `
      <p><strong>${user.name}</strong></p>
      <p>${user.email}</p>
      <p>${user.address.street} / ${user.address.city}</p>
      
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Sil";

    // Silme event'i user id'e göre ekledik.
    deleteBtn.addEventListener("click", () => deleteUser(user.id));

    card.appendChild(info);
    card.appendChild(deleteBtn);
    container.appendChild(card);
  });
}

// Kullanıcıyı hem dom'dan hem de localstorage'dan silmek için : 
function deleteUser(id) {
  // localStorage'taki veriyi al
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!stored) return;

 let filtered = [];
stored.data.forEach(function(u) {
  // ID karşılaştırmasında tip farkını önlemek için parseInt kullanıyoruz
  if (parseInt(u.id) !== parseInt(id)) {
    filtered.push(u);
  }
});

  // Güncel listeyi kaydetmek ve yeniden render etmek :
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ data: filtered, timestamp: stored.timestamp })
  );

  renderUsers(filtered);
}

function showError(message) {
  container.innerHTML = `<p class="error-message">${message}</p>`;
}
