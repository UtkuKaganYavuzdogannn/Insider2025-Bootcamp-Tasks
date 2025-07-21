/* eslint-disable */
(($) => {
    'use strict';

    const classes = {
        style: 'custom-style',
        wrapper: 'custom-wrapper',
        container: 'custom-container',
        addToCartButton: 'add-to-cart-btn',
        detailButton: 'detail-btn',
        productImage: 'product-image',
        productPrice: 'product-price',
        cart: 'cart',
        clearCartButton: 'clear-cart-btn',
        searchInput: 'search-input'
    };

    const selectors = {
        style: `.${classes.style}`,
        wrapper: `.${classes.wrapper}`,
        container: `.${classes.container}`,
        addToCartButton: `.${classes.addToCartButton}`,
        detailButton: `.${classes.detailButton}`,
        cart: `.${classes.cart}`,
        clearCartButton: `.${classes.clearCartButton}`,
        searchInput: `.${classes.searchInput}`,
        appendLocation: '#container'
    };

    const self = {
        allProducts: []
    };

    self.init = () => {
        self.reset();
        self.buildCSS();
        self.buildHTML();
        self.fetchProducts();
        self.setEvents();
    };

    self.reset = () => {
        $(selectors.style).remove();
        $(selectors.wrapper).remove();
        $(document).off('.eventListener');
    };

    self.buildCSS = () => {
        const customStyle = `
        <style class="custom-style">
    body {
        margin: 0;
        padding: 0;
        background: url('https://serkainternational.com/wp-content/uploads/2022/08/proje-petek-1.jpg') no-repeat center center fixed;
        background-size: cover;
        font-family: Arial, sans-serif;
    }

    .custom-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
    }

    /* Slider alanı */
    #slider {
        width: 80%;
        margin: 20px auto;
    }
    #slider img {
        width: 100%;
        max-height: 300px;
        object-fit: cover;
    }

    /* Ürün listesi grid */
    #productList {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
        width: 80%;
        max-width: 1000px;
        margin: 0 auto;
    }

    .custom-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 10px;
        align-items: center;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid #ccc;
        padding: 15px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        border-radius: 8px;
        min-height: 320px;
        transition: transform 0.3s;
        position: relative;
    }

    .product-image {
        width: 100%;
        max-height: 150px;
        object-fit: contain;
        cursor: pointer;
    }

    .product-price {
        font-weight: bold;
        font-size: 16px;
    }

    .add-to-cart-btn,
    .clear-cart-btn,
    .detail-btn {
        display: block;
        width: 100%;
        padding: 8px 14px;
        background-color: #3498db;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
    }
    .add-to-cart-btn:hover,
    .clear-cart-btn:hover,
    .detail-btn:hover {
        background-color: #2980b9;
    }

    /* Sepetteki ürünler */
    .cart {
        position: fixed;
        right: 20px;
        bottom: 20px;
        background: rgba(255,255,255,0.95);
        border: 1px solid #333;
        padding: 10px;
        width: 280px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        border-radius: 6px;
        max-height: 400px;
        overflow-y: auto;
    }
    .cart .custom-container {
        margin-bottom: 10px;
        position: relative;
    }

    /* Sepetten silme butonu */
    .remove-from-cart-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        background-color: #e74c3c;
        border: none;
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        font-weight: bold;
        cursor: pointer;
        line-height: 20px;
    }
    .remove-from-cart-btn:hover {
        background-color: #c0392b;
    }

    /* Hover animasyonu */
    .hovered {
        border-color: #3498db;
        box-shadow: 0 0 10px rgba(0,123,255,0.5);
        transform: scale(1.02);
    }

    /* Arama inputu */
    .search-input {
        display: block;
        width: 300px;
        padding: 8px;
        margin: 10px auto 20px auto;
        border: 1px solid #ccc;
        border-radius: 4px;
        text-align: center;
    }
    </style>

        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"/>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css"/>
        <script src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css" />
        <script src="https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.umd.js"></script>
        `;
        $('head').append(customStyle);
    };

    self.buildHTML = () => {
        const html = `
            <input type="text" class="${classes.searchInput}" placeholder="Ürün ara veya ID gir" 
                   style="display:block;margin:20px auto;padding:8px;width:300px;">

            <div class="slider"></div>
            <div class="${classes.wrapper}">
                <div id="productList"></div>
            </div>
            <div class="${classes.cart}">
                <h3>Sepet</h3>
                <div id="cartItems"></div>
                <button class="${classes.clearCartButton}">Sepeti Temizle</button>
            </div>
        `;
        $(selectors.appendLocation).append(html);
    };

    self.fetchProducts = () => {
        $.get('https://fakestoreapi.com/products', function(products) {
            self.allProducts = products;
            self.renderProducts(products);
            self.initSlider(products);
            self.loadCartFromLocalStorage();
        });
    };

    self.renderProducts = (products) => {
        const list = $("#productList");
        list.empty();
        products.forEach(product => {
            const card = self.buildProductCard(product);
            list.append(card.hide().fadeIn(500));
        });
    };

    self.buildProductCard = (product) => {
        return $(`<div class="${classes.container}" 
                    data-id="${product.id}" 
                    data-title="${product.title}" 
                    data-description="${product.description}" 
                    data-image="${product.image}">
                <img src="${product.image}" alt="${product.title}" 
                     class="${classes.productImage}" 
                     data-fancybox="gallery" 
                     data-caption="<strong>${product.title}</strong><br>${product.description}">
                <p>${product.title}</p>
                <p class="${classes.productPrice}">${product.price} $</p>
                <button class="${classes.addToCartButton}">Sepete Ekle</button>
                <button class="${classes.detailButton}">Detay Göster</button>
            </div>`);
    };

    self.setEvents = () => {
        // Sepete ekle
        $(document).on('click.eventListener', selectors.addToCartButton, function () {
            const card = $(this).closest(selectors.container);
            const id = card.data('id');

            // Sepette aynı ürün var mı kontrol et
            const exists = $("#cartItems").children().toArray().some(el => $(el).data('id') === id);
            if (exists) {
                alert('Bu ürün zaten sepette!');
                return;
            }

            // Klonla ve data-id koru
            const cloned = card.clone(false);
            cloned.attr('data-id', id).attr('data-title', card.data('title'));
            cloned.find(selectors.addToCartButton).remove();
            cloned.append('<button class="remove-from-cart-btn">×</button>');
            $("#cartItems").append(cloned);

            self.updateLocalStorage();
        });

        // Sepeti temizleme
        $(document).on('click.eventListener', selectors.clearCartButton, function () {
            $("#cartItems").empty();
            localStorage.removeItem('cart');
        });

        // silme
        $(document).on('click.eventListener', '.remove-from-cart-btn', function () {
            $(this).closest(selectors.container).remove();
            self.updateLocalStorage();
        });

        // hover 
        $(document).on('mouseenter.eventListener mouseleave.eventListener', selectors.container, function () {
            $(this).toggleClass('hovered').fadeTo(200, $(this).hasClass('hovered') ? 0.9 : 1);
        });

        // Fancybox detay kısmında
        $(document).on('click.eventListener', selectors.detailButton, function () {
            const card = $(this).closest(selectors.container);
            Fancybox.show([{
                src: card.data('image'),
                type: 'image',
                caption: `<strong>${card.data('title')}</strong><br>${card.data('description')}`
            }]);
        });

        // Filtre
        let timer;
        $(document).on('input.eventListener', selectors.searchInput, function () {
            clearTimeout(timer);
            const val = $(this).val().toLowerCase().trim();
            timer = setTimeout(() => {
                const filtered = val
                    ? self.allProducts.filter(p =>
                        p.title.toLowerCase().includes(val) || p.id.toString() === val)
                    : self.allProducts;
                self.renderProducts(filtered);
            }, 300);
        });
    };

    self.updateLocalStorage = () => {
        const ids = [];
        $("#cartItems").children().each(function () {
            ids.push($(this).data('id'));
        });
        localStorage.setItem('cart', JSON.stringify(ids));
    };

    self.loadCartFromLocalStorage = () => {
        const saved = JSON.parse(localStorage.getItem('cart')) || [];
        saved.forEach(id => {
            const product = self.allProducts.find(p => p.id === id);
            if (product) {
                const card = self.buildProductCard(product);
                card.attr('data-id', product.id).attr('data-title', product.title);
                card.find(selectors.addToCartButton).remove();
                card.append('<button class="remove-from-cart-btn">×</button>');
                $("#cartItems").append(card);
            }
        });
    };

    self.initSlider = (products) => {
        const slider = $(".slider");
        slider.empty();
        products.slice(0, 5).forEach(p => {
            slider.append(`<div><img src="${p.image}" alt="${p.title}" style="height:150px;margin:auto;"></div>`);
        });
        slider.slick({
            autoplay: true,
            dots: true,
            arrows: false
        });
    };

    $(document).ready(self.init);
})(jQuery);
