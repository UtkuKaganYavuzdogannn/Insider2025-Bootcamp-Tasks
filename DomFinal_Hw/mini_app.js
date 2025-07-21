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
        clearCartButton: 'clear-cart-btn'
    };

    const selectors = {
        style: `.${classes.style}`,
        wrapper: `.${classes.wrapper}`,
        container: `.${classes.container}`,
        addToCartButton: `.${classes.addToCartButton}`,
        detailButton: `.${classes.detailButton}`,
        cart: `.${classes.cart}`,
        clearCartButton: `.${classes.clearCartButton}`,
        appendLocation: '#container'
    };

    const self = {};

    self.init = () => {
        self.reset();
        self.buildCSS();
        self.buildHTML();
        self.fetchProducts();
        self.setEvents();
        self.loadCartFromLocalStorage();  // Sepeti yükle
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
        justify-content: center;
        padding: 20px;
    }

    #productList {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
        width: 80%;
        max-width: 1000px;
        margin: 0 auto;
    }

    .custom-container {
        display: flex; /* Ürünlerin görünmesini sağlamak için eklendi */
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

    /* Sepetteki ürünlerdeki sil butonu */
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

    /* Hover animasyonu için */
    .hovered {
        border-color: #3498db;
        box-shadow: 0 0 10px rgba(0,123,255,0.5);
        transform: scale(1.02);
    }
    </style>

        `;
        $('head').append(customStyle);

        // Fancybox (Modal) CDN ekle
        $('head').append(`
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css" />
            <script src="https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.umd.js"></script>
        `);
    };

    self.buildHTML = () => {
        const html = `
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
        $.get('https://fakestoreapi.com/products?limit=6', function(products) {
            products.forEach(product => {
                const productCard = self.buildProductCard(product);
                $("#productList").append(productCard);
                productCard.fadeIn(600);
            });
        });
    };

    self.buildProductCard = (product) => {
        return $(`
            <div class="${classes.container}" 
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
            </div>
        `);
    };

    self.setEvents = () => {
        // Sepete ekle
        $(document).on('click.eventListener', selectors.addToCartButton, function () {
            const card = $(this).closest(selectors.container);
            const title = card.data('title');

            // Sepette aynı ürün var mı kontrol et
            const exists = $("#cartItems").children().toArray().some(el => $(el).data('title') === title);
            if(exists) {
                alert('Bu ürün zaten sepette!');
                return;
            }

            const clonedCard = card.clone(true);
            clonedCard.find(selectors.addToCartButton).remove(); 
            clonedCard.append('<button class="remove-from-cart-btn">×</button>'); // silme butonu

            $("#cartItems").append(clonedCard);
            self.updateLocalStorage();
        });

        // Sepeti temizle
        $(document).on('click.eventListener', selectors.clearCartButton, function () {
            $("#cartItems").empty();
            localStorage.removeItem('cart');
        });

        // Sepetten ürün sil
        $(document).on('click.eventListener', '.remove-from-cart-btn', function() {
            $(this).closest(selectors.container).remove();
            self.updateLocalStorage();
        });

        // Hover animasyonu
        $(document).on('mouseenter.eventListener mouseleave.eventListener', selectors.container, function () {
            $(this).toggleClass('hovered').fadeTo(200, $(this).hasClass('hovered') ? 0.9 : 1);
        });

        // Detay Göster (Fancybox modal)
        $(document).on('click.eventListener', selectors.detailButton, function () {
            const card = $(this).closest(selectors.container);
            const img = card.data('image');
            const title = card.data('title');
            const desc = card.data('description');

            Fancybox.show([{
                src: img,
                type: 'image',
                caption: `<strong>${title}</strong><br>${desc}`
            }]);
        });
    };

    self.updateLocalStorage = () => {
        const items = [];
        $("#cartItems").children().each(function() {
            items.push($(this).data('title'));
        });
        localStorage.setItem('cart', JSON.stringify(items));
    };

    self.loadCartFromLocalStorage = () => {
        const savedItems = JSON.parse(localStorage.getItem('cart')) || [];
        savedItems.forEach(title => {
            // Ürün listesinde karşılığı varsa onu klonlayıp sepete ekle
            const productCard = $(`${selectors.container}[data-title="${title}"]`).first();
            if(productCard.length) {
                const clonedCard = productCard.clone(true);
                clonedCard.find(selectors.addToCartButton).remove();
                clonedCard.append('<button class="remove-from-cart-btn">×</button>');
                $("#cartItems").append(clonedCard);
            }
        });
    };

    $(document).ready(self.init);
})(jQuery);
