document.addEventListener("DOMContentLoaded", () => {
    async function fetchProducts() {
        try {
            // Fetch product data from Fake Store API
            const response = await fetch("https://fakestoreapi.com/products");
            const products = await response.json();
            displayProducts(products);
            attachCartEvents(); // Attach cart functionality
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    // function to display products
    function displayProducts(products) {
        const productList = document.getElementById("product-list");
        // Populate product list dynamically using map function
        productList.innerHTML = products.map(product => `
            <div class="col">
                <div class="card h-100 product-card" data-id="${product.id}">
                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                    <div class="card-body text-center d-flex flex-column">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text text-danger">$${product.price.toFixed(2)}</p>
                        <button class="btn btn-success mt-auto add-to-cart"
                            data-id="${product.id}"
                            data-price="${product.price}"
                            data-title="${product.title}"
                            data-image="${product.image}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join(""); // Using join to prevent multiple reflows

        attachProductDetailEvent(products);
        attachAddToCartEvent(); // Enable add-to-cart functionality
    }

    function attachProductDetailEvent(products) {
        document.querySelectorAll(".product-card").forEach(card => {
            card.addEventListener("click", (event) => {
                if (event.target.classList.contains("add-to-cart")) return; 
                const productId = card.dataset.id;
                const product = products.find(p => p.id == productId);
                showProductDetail(product);
            });
        });
    }

    // function to display product's details
    function showProductDetail(product) {
        if (!product) return;
        const productDetail = document.getElementById("product-detail");
        const productListSection = document.getElementById("products");

        // Dynamically display product details
        productDetail.innerHTML = `
            <div class="container mt-5">
                <button id="back-to-products" class="btn btn-outline-danger mb-3">← Back to Products</button>
                <div class="row align-items-center">
                    <div class="col-md-6 text-center">
                        <img src="${product.image}" alt="${product.title}" class="img-fluid product-img">
                    </div>
                    <div class="col-md-6">
                        <h2>${product.title}</h2>
                        <p class="text-muted">${product.category}</p>
                        <p class="text-danger">$${product.price.toFixed(2)}</p>
                        <p>${product.description}</p>
                        <button class="btn btn-success mt-2 add-to-cart"
                            data-id="${product.id}"
                            data-price="${product.price}"
                            data-title="${product.title}"
                            data-image="${product.image}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById("back-to-products").addEventListener("click", () => {
            productDetail.style.display = "none";
            productListSection.style.display = "block";
        });

        productDetail.style.display = "block";
        productListSection.style.display = "none";

        attachAddToCartEvent(); // Ensure "Add to Cart" works in details view
    }

    function attachAddToCartEvent() {
        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", (event) => {
                event.stopPropagation(); 
                const { id, price, title, image } = event.target.dataset;
                let cart = JSON.parse(localStorage.getItem("cart")) || [];

                const existingItem = cart.find(item => item.id === id);
                existingItem ? existingItem.quantity++ : cart.push({ id, title, price: parseFloat(price), image, quantity: 1 });

                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount(); // Update cart icon count
                showCartNotification(title);
            });
        });
    }

    // function to update cart count
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        document.getElementById("cart-count").textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    }

    // function for cart notification
    function showCartNotification(title) {
        const cartToggler = document.getElementById("cart-toggler");
        cartToggler.textContent = `${title} added to cart!`;
        cartToggler.style.display = "block";
        setTimeout(() => cartToggler.style.display = "none", 2000);
    }

    function attachCartEvents() {
        const cartItemsContainer = document.getElementById("cart-items");
        const subtotalElement = document.getElementById("subtotal");
        const taxElement = document.getElementById("tax");
        const totalElement = document.getElementById("total");
        const clearCartBtn = document.getElementById("clear-cart-btn");
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        function renderCart() {
            cartItemsContainer.innerHTML = cart.map(item => `
                <tr>
                    <td>
                        <img src="${item.image}" alt="${item.title}" class="cart-img">
                    </td>
                    <td>${item.title}</td>
                    <td>
                        <input type="number" class="form-control quantity-input" data-id="${item.id}" min="1" value="${item.quantity}">
                    </td>
                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                    <td><button class="btn btn-danger remove-item" data-id="${item.id}">Remove</button></td>
                </tr>
            `).join("");
            updateSummary();
        }

        // function to update cart summary
        function updateSummary() {
            const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const tax = subtotal * 0.175;
            const total = subtotal + tax;
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            taxElement.textContent = `$${tax.toFixed(2)}`;
            totalElement.textContent = `$${total.toFixed(2)}`;
        }

        clearCartBtn.addEventListener("click", () => {
            cart = [];
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        });

        renderCart();
    }

    fetchProducts(); // Fetch and display products on page
    updateCartCount(); // Update cart count at startup
});
