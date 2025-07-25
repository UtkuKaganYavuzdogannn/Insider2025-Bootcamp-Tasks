const appendLocation = "#userList";

const apiURL = "https://jsonplaceholder.typicode.com/users";
const STORAGE_KEY = "usersData";
const ONE_DAY = 24 * 60 * 60 * 1000;  // 1 gün milisaniye olarak düzeltildi

let container = document.querySelector(appendLocation);

document.addEventListener("DOMContentLoaded", () => 
{
  addStyles();        
  addTitle();         
  loadUsers();        
  observeForReloadButton(); 
});


function addStyles() {
  const style = document.createElement("style");
  style.textContent = `
    h1.page-title {
      text-align: center;
      font-family: Arial, sans-serif;
      margin-bottom: 20px;
    }
    .user-card {
      border: 1px solid #ccc;
      padding: 10px;
      margin: 5px auto;
      border-radius: 5px;
      display: flex;
      justify-content: space-between;
      background: #ffff99; /* geçerli sarı renk */
      max-width: 500px;
      align-items: center;
    }
    .delete-btn {
      background: red;
      color: #fff;
      border: none;
      padding: 12px 16px;
      cursor: pointer;
      border-radius: 50%; /* yuvarlak */
      font-size: 16px;
    }
    .delete-btn:hover {
      background: #cc0000; /* geçerli koyu kırmızı hover rengi */
    }
    .reload-btn {
      display: block;
      background: #2ecc71;
      color: #fff;
      border: none;
      padding: 15px 30px;
      margin: 20px auto;
      cursor: pointer;
      border-radius: 6px;
      font-size: 18px;
    }
    .reload-btn:hover {
      background: #27ae60;
    }
  `;
  document.head.appendChild(style);
}

function addTitle() {
  const title = document.createElement("h1");
  title.className = "page-title";
  title.textContent = "Kullanıcı Listesi";
  document.body.insertBefore(title, container);
}


function loadUsers() {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const now = Date.now();

  // localStorage'taki veri yoksa veya süresi dolmuşsa API'den çek
  if (!stored || now - stored.timestamp >= ONE_DAY) 
    {
    fetchUsers();
    }
  else
    {
    renderUsers(stored.data);
    }
}



// Api
async function fetchUsers() {
  try {
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error("API isteği başarısız");
    const data = await res.json();

    // localStorage kayıt
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));

    renderUsers(data);
  } catch (err) {
    container.innerHTML = `<p style="color:red">${err.message}</p>`;
  }
}


function renderUsers(users) {
  container.innerHTML = ""; 

  users.forEach(user => {
    const card = document.createElement("div");
    card.className = "user-card";
    card.dataset.id = user.id;

    card.innerHTML = `
      <div>
        <p><strong>${user.name}</strong></p>
        <p>${user.email}</p>
        <p>${user.address.street} / ${user.address.city}</p>
      </div>
      <button class="delete-btn">X</button>
    `;

    // silme butonuna tıklanınca kullanıcıyı kaldır
    card.querySelector(".delete-btn").addEventListener("click", () => deleteUser(user.id));
    container.appendChild(card);
  });
}


function deleteUser(id) {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!stored) return;

  // yeni dizi oluşturup silinen kullanıcıyı hariç tut
  let filtered = [];
  for (let i = 0; i < stored.data.length; i++) {
    let u = stored.data[i];
    if (parseInt(u.id) !== parseInt(id)) {
      filtered.push(u);
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    data: filtered,
    timestamp: stored.timestamp
  }));

  renderUsers(filtered);
}



// Tüm kullanıcılar silinirse gösterilecek buton
function showReloadButton() {
  if (sessionStorage.getItem("reloadUsed")) return;

  const btn = document.createElement("button");
  btn.className = "reload-btn";
  btn.textContent = "Kullanıcıları Yeniden Yükle";

  btn.addEventListener("click", () => {
    sessionStorage.setItem("reloadUsed", "true");
    fetchUsers();
    btn.remove();
  });

  container.appendChild(btn);
}

// DOM'da değişiklik olursa (kullanıcılar silinirse) buton kontrolü
function observeForReloadButton() {
  const observer = new MutationObserver(() => {
    const users = container.querySelectorAll(".user-card");
    const reloadBtn = container.querySelector(".reload-btn");
    if (users.length === 0 && !reloadBtn) {
      showReloadButton();
    }
  });

  observer.observe(container, { childList: true });
}
