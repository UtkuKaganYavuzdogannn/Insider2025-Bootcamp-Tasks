(() => {
  const API_URL =
    "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
  const STORAGE_KEY = "lcwProducts";
  const FAVORITES_KEY = "lcwFavorites";
  const CACHE_TIME = 24 * 60 * 60 * 1000;

  let isDown = false;
  let startX;
  let scrollLeft;
  let favorites = new Set();

  const init = async () => {
    const productDetail = document.querySelector(".product-detail");
    if (!productDetail) return;

    const favData = localStorage.getItem(FAVORITES_KEY);
    if (favData) {
      try {
        const parsed = JSON.parse(favData);
        if (Array.isArray(parsed)) {
          favorites = new Set(parsed);
        } else {
          favorites = new Set();
        }
      } catch {
        favorites = new Set();
      }
    }

    let products = await loadProducts();
    buildCarousel(productDetail, products);
    buildCSS();
    enableScroll();
    enableButtons();
    enableFavorites();
  };

  async function loadProducts() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TIME) {
        return parsed.data;
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("API Hatası");
      const data = await res.json();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ timestamp: Date.now(), data })
      );
      return data;
    } catch (e) {
      console.error("Veri alınamadı:", e);
      return [];
    }
  }

  function buildCarousel(container, products) {
    const productCards = products
      .map((p) => {
        const isFav = favorites.has(p.id);
        return `
          <div class="lcw-product-item">
            <a href="${p.url}" target="_blank" class="lcw-product-link">
              <img src="${p.img}" alt="${p.name}" class="lcw-product-image">
              <div class="lcw-product-info">
                <h4 class="lcw-product-name">${p.name}</h4>
                <p class="lcw-product-price">${p.price.toFixed(2)} TL</p>
                <button class="product-add-to-cart">Sepete Ekle</button>
              </div>
            </a>
            <div class="lcw-favorite-icon ${isFav ? "favorited" : ""}" data-id="${p.id}">&#x2764;</div>
          </div>
        `;
      })
      .join("");

    const wrapper = document.createElement("div");
    wrapper.className = "carousel-area";
    wrapper.innerHTML = `
      <div class="carousel-container">
        <p class="tavsiye-urunler-title">You Might Also Like</p>
        <div class="carousel-responsive">
          <div class="horizontal">
            ${productCards}
          </div>
        </div>
        <button class="lcw-carousel-nav lcw-carousel-nav-prev" disabled>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="24" viewBox="0 0 14.242 24.242">
            <path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px"
              d="M2106.842 2395.467l-10 10 10 10"
              transform="translate(-2094.721 -2393.346)"></path>
          </svg>
        </button>
        <button class="lcw-carousel-nav lcw-carousel-nav-next">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="24" viewBox="0 0 14.242 24.242" style="transform:rotate(180deg);">
            <path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px"
              d="M2106.842 2395.467l-10 10 10 10"
              transform="translate(-2094.721 -2393.346)"></path>
          </svg>
        </button>
      </div>
    `;
    container.insertAdjacentElement("afterend", wrapper);
  }

  function buildCSS() {
    const css = `
      body {
        font-family:'Open Sans',sans-serif;
        margin:0;
        padding:0;
        overflow-x:hidden;
        color:#333;
      }

      .carousel-area {
        background:#F4F5F7;
        padding:15px 0;
        width:100%;
        box-sizing:border-box;
      }

      .carousel-container {
        position:relative;
        width:85%;
        margin:0 auto;
        padding:0 20px;
        box-sizing:border-box;
      }

      .tavsiye-urunler-title {
        text-align:left;
        margin:0;
        font-size:32px;
        line-height:33px;
        font-weight:300;
        color:#29323B;
        padding:15px 0;
        margin-left:40px;
      }

      .lcw-product-link {
        text-decoration:none;
        color:inherit;
        display:flex;
        flex-direction:column;
        height:100%;
      }
      .lcw-product-link:hover { text-decoration:none; }

      .carousel-responsive {
        position:relative;
        overflow:hidden;
        padding:0 40px;
      }

      .horizontal {
        display:flex;
        overflow-x:scroll;
        scroll-behavior:smooth;
        -ms-overflow-style:none;
        scrollbar-width:none;
      }
      .horizontal::-webkit-scrollbar { display:none; }

      /* Kartlar: border yok, radius yok, arası 2px */
      .lcw-product-item {
        flex:0 0 auto;
        width:calc(100% / 5 - 12px);
        max-width:220px;
        margin:0 2px;
        background:#fff;
        border:none;
        border-radius:0;
        position:relative;
        cursor:pointer;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
      }

      .lcw-product-image {
        width:100%;
        aspect-ratio:3/4;
        height:auto;
        object-fit:cover;
        display:block;
      }

      .lcw-product-info {
        padding:6px 10px;
        display:flex;
        flex-direction:column;
        flex:1;
      }
      .lcw-product-name {
        font-size:13px;
        font-weight:400;
        margin:4px 0 8px 0;
        color:#555;
      }
      .lcw-product-price {
        font-size:18px;
        font-weight:bold;
        color:#193db0;
        margin-top:auto;
      }

      .product-add-to-cart {
        display:none;
        height:30px;
        background-color:#193db0;
        color:#fff;
        width:97%;
        border-radius:0;
        border:none;
        line-height:19px;
        font-size:14px;
        font-weight:bold;
        text-transform:uppercase;
        text-align:center;
        margin-top:8px;
        cursor:pointer;
      }

      .lcw-favorite-icon {
        position:absolute;
        top:10px;
        right:10px;
        font-size:20px;
        color:white;
        cursor:default;
      }
      .lcw-favorite-icon.favorited { color:#007bff; }

      .lcw-carousel-nav {
        position:absolute;
        top:63%;
        transform:translateY(-50%);
        background:transparent;
        border:none;
        width:30px;
        height:30px;
        cursor:pointer;
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:10;
      }
      .lcw-carousel-nav:disabled { cursor:default; }

      /* Oklar konteynır içine 10px sarkıyor */
      .lcw-carousel-nav-prev { left:-10px; }
      .lcw-carousel-nav-next { right:-10px; }

      @media(max-width:992px){
        .lcw-product-item { 
          width:calc((100% - 64px) / 3);
          max-width:none;
        }
        .horizontal { padding-right:0; }
        .product-add-to-cart { display:block; }
        .lcw-carousel-nav { display:none !important; }
        .tavsiye-urunler-title { font-size:22px; }
      }

      @media(max-width:450px){
        .lcw-product-item { width:280px; }
      }

      @media(max-width:768px){
        .lcw-product-item { width:240px; }
        .tavsiye-urunler-title { font-size:20px; }
      }

      @media(max-width:480px){
        .lcw-product-item { width:100%; }
        .tavsiye-urunler-title { font-size:18px; }
      }
    `;
    if (!document.querySelector(".lcw-carousel-style")) {
      const style = document.createElement("style");
      style.className = "lcw-carousel-style";
      style.textContent = css;
      document.head.appendChild(style);
    }
  }

  function enableFavorites() {
    const favIcons = document.querySelectorAll(".lcw-favorite-icon");
    favIcons.forEach((icon) => {
      icon.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = parseInt(icon.dataset.id, 10);
        if (favorites.has(id)) {
          favorites.delete(id);
          icon.classList.remove("favorited");
        } else {
          favorites.add(id);
          icon.classList.add("favorited");
        }
        localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
      });
    });
  }

  function enableScroll() {
    const slider = document.querySelector(".horizontal");
    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener("mouseleave", () => (isDown = false));
    slider.addEventListener("mouseup", () => (isDown = false));
    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    });
  }

  function enableButtons() {
    const slider = document.querySelector(".horizontal");
    const prevBtn = document.querySelector(".lcw-carousel-nav-prev");
    const nextBtn = document.querySelector(".lcw-carousel-nav-next");

    const updateNavState = () => {
      prevBtn.disabled = slider.scrollLeft <= 0;
      const maxScroll = slider.scrollWidth - slider.clientWidth - 1;
      nextBtn.disabled = slider.scrollLeft >= maxScroll;
    };

    prevBtn.addEventListener("click", () => {
      if (!prevBtn.disabled) {
        slider.scrollBy({ left: -300, behavior: "smooth" });
        setTimeout(updateNavState, 400);
      }
    });

    nextBtn.addEventListener("click", () => {
      if (!nextBtn.disabled) {
        slider.scrollBy({ left: 300, behavior: "smooth" });
        setTimeout(updateNavState, 400);
      }
    });

    slider.addEventListener("scroll", updateNavState);
    window.addEventListener("resize", updateNavState);
    updateNavState();
  }

  init();
})();
