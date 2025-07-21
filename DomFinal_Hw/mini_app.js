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
    };

    self.reset = () => {
        $(selectors.style).remove();
        $(selectors.wrapper).remove();
        $(document).off('.eventListener');
    };

    self.buildCSS = () => {
        const customStyle = `
            <style class="${classes.style}">
                ${selectors.wrapper} {
                    display: flex;
                    justify-content: center;
                    padding: 10px;
                    background-color: #f1f12f;
                }

                #productList {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 20px;
                    width: 80%;
                    max-width: 1000px;
                    margin: 0 auto;
                }

                ${selectors.container} {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    align-items: center;
                    background: white;
                    border: 1px solid #ccc;
                    padding: 10px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    display: none;
                    transition: transform 0.3s;
                }

                .${classes.productImage} {
                    width: 100%;
                    max-height: 120px;
                    object-fit: contain;
                    cursor: pointer;
                }

                .${classes.productPrice} {
                    font-weight: bold;
                }

                ${selectors.addToCartButton}, ${selectors.clearCartButton}, ${selectors.detailButton} {
                    padding: 6px 12px;
                    background-color: #3498db;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 5px;
                }

                ${selectors.addToCartButton}:hover, ${selectors.clearCartButton}:hover, ${selectors.detailButton}:hover {
                    background-color: #2980b9;
                }

                ${selectors.cart} {
                    position: fixed;
                    right: 20px;
                    bottom: 20px;
                    background: #fff;
                    border: 1px solid #333;
                    padding: 10px;
                    width: 220px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }

                /* Hover için sınıf */
                .hovered {
                    border-color: #3498db;
                    box-shadow: 0 0 10px rgba(0,123,255,0.5);
                }
            </style>
        `;
        $('head').append(customStyle);
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
            <div class="${classes.container}" data-title="${product.title}" data-description="${product.description}" data-image="${product.image}">
                <img src="${product.image}" alt="${product.title}" class="${classes.productImage}" data-fancybox="gallery" data-caption="${product.title} - ${product.description}">
                <p>${product.title}</p>
                <p class="${classes.productPrice}">${product.price} $</p>
                <button class="${classes.addToCartButton}">Sepete Ekle</button>
            </div>
        `);
    };

    self.setEvents = () => {
        // Sepete ekle
        $(document).on('click.eventListener', selectors.addToCartButton, function () {
            const card = $(this).closest(selectors.container).clone(true);
            card.find(selectors.addToCartButton).remove(); 
            $("#cartItems").append(card);
            self.updateLocalStorage();
        });

        // Sepeti temizle
        $(document).on('click.eventListener', selectors.clearCartButton, function () {
            $("#cartItems").empty();
            localStorage.removeItem('cart');
        });

        // Hover animasyonu
        $(document).on('mouseenter.eventListener mouseleave.eventListener', selectors.container, function () {
            $(this).toggleClass('hovered').fadeTo(200, $(this).hasClass('hovered') ? 0.9 : 1);
        });
    };

    self.updateLocalStorage = () => {
        const items = [];
        $("#cartItems").children().each(function() {
            items.push($(this).data('title'));
        });
        localStorage.setItem('cart', JSON.stringify(items));
    };

    $(document).ready(self.init);
})(jQuery);
