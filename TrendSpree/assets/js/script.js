// Wait until the document is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Fetch product data from Fake Store API
    async function fetchProducts() {
        try {
            const response = await fetch("https://fakestoreapi.com/products");
            const products = await response.json();
            displayProducts(products);
            updateCartCount();

            // Check URL for product ID and show product detail if present
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get("product");
            if (productId) {
                const product = products.find(p => p.id == productId);
                if (product) {
                    showProductDetail(product);
                }
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    // Function to display products on the page
    function displayProducts(products) {
        const productList = document.getElementById("product-list");
        productList.innerHTML = ""; // Clear previous entries
        products.forEach(product => {
            productList.innerHTML += `
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
            `;
        });

        attachProductDetailEvent(products);
        attachAddToCartEvent(); // Enable add-to-cart functionality
    }

    // Function to handle product detail view using URL query parameters
    function attachProductDetailEvent(products) {
        document.querySelectorAll(".product-card").forEach(card => {
            card.addEventListener("click", (event) => {
                if (event.target.classList.contains("add-to-cart")) {
                    return; // Prevent triggering detail view when adding to cart
                }
                
                const productId = event.currentTarget.dataset.id;
                window.location.search = `?product=${productId}`; // Update URL
            });
        });
    }

    // Function to show product details
    function showProductDetail(product) {
        if (!product) return;

        const productDetail = document.getElementById("product-detail");
        const productListSection = document.getElementById("products");

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
            window.location.search = ""; // Clear URL query and return to product list
        });

        productDetail.style.display = "block";
        productListSection.style.display = "none";
        attachAddToCartEvent(); // Ensure "Add to Cart" works in detail view
    }

    // Function to add items to cart
    function attachAddToCartEvent() {
        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", (event) => {
                const id = event.target.dataset.id;
                const price = parseFloat(event.target.dataset.price);
                const title = event.target.dataset.title;
                const image = event.target.dataset.image;

                let cart = JSON.parse(localStorage.getItem("cart")) || [];

                const existingItem = cart.find(item => item.id === id);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ id, title, price, image, quantity: 1 });
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                showCartNotification(title);
            });
        });
    }

    // Function to update cart count in navbar
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        document.getElementById("cart-count").textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    }

    // Function to show cart notification
    function showCartNotification(title) {
        const cartToggler = document.getElementById("cart-toggler");
        cartToggler.textContent = `${title} added to cart!`;
        cartToggler.classList.add("show");
        setTimeout(() => cartToggler.classList.remove("show"), 2000);
    }

    fetchProducts(); // Load products on page load
    updateCartCount(); // Update cart count on page load
});



// Cart Page Functionality
document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");
    const cartToggler = document.getElementById("cart-toggler");
    const clearCartToggler = document.getElementById("clear-cart-toggler");
    const emptyCartToggler = document.getElementById("empty-cart-toggler");
    const clearCartBtn = document.getElementById("clear-cart-btn");
    const cartCountElement = document.getElementById("cart-count");
    const checkoutBtn = document.querySelector(".checkout-btn");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    checkoutBtn.addEventListener("click", () => {
        alert("Checkout failed");
    });

    // Function to show toggler messages
    function showToggler(message, togglerElement) {
        togglerElement.textContent = message;
        togglerElement.style.display = "block";
        setTimeout(() => {
            togglerElement.style.display = "none";
        }, 1500);
    }

    // Function to render cart
    function renderCart() {
        cartItemsContainer.innerHTML = "";
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <img src="${item.image}" alt="${item.title}" class="cart-img">
                    <div>
                        <p>${item.title}</p>
                        <small class="text-danger">Price: $${item.price.toFixed(2)}</small><br>
                        <a href="#" class="text-danger remove-item" data-id="${item.id}">Remove</a>
                    </div>
                </td>
                <td>
                    <div class="quantity-container">
                        <button class="decrease-qty" data-id="${item.id}">−</button>
                        <input type="number" class="quantity-input" data-id="${item.id}" min="1" value="${item.quantity}" readonly>
                        <button class="increase-qty" data-id="${item.id}">+</button>
                    </div>
                </td>

                <td>$${itemTotal.toFixed(2)}</td>
            `;

            cartItemsContainer.appendChild(row);
        });

        updateSummary(subtotal);
        updateCartCount();
        attachEventListeners();
    }

    // Function to update cart summary
    function updateSummary(subtotal) {
        const tax = subtotal * 0.175; // 17.5% tax
        const total = subtotal + tax;

        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    // Function to attach event listeners
    function attachEventListeners() {
        document.querySelectorAll(".increase-qty").forEach(button => {
            button.addEventListener("click", (event) => {
                const id = event.target.dataset.id;
                cart = cart.map(item => {
                    if (item.id === id) {
                        item.quantity++;
                    }
                    return item;
                });
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
                showToggler("Quantity Updated!", cartToggler);
            });
        });

        document.querySelectorAll(".decrease-qty").forEach(button => {
            button.addEventListener("click", (event) => {
                const id = event.target.dataset.id;
                cart = cart.map(item => {
                    if (item.id === id && item.quantity > 1) {
                        item.quantity--;
                    }
                    return item;
                });
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
                showToggler("Quantity Updated!", cartToggler);
            });
        });

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const id = event.target.dataset.id;
                cart = cart.filter(item => item.id !== id);
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
                showToggler("Item Removed!", cartToggler);
            });
        });
    }

    // Function to update cart count in navbar
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }

    // Clear Cart Button Functionality
    clearCartBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            showToggler("Cart is already empty!", emptyCartToggler);
            return;
        }
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        showToggler("Cart Cleared!", clearCartToggler);
    });

    renderCart();
});


