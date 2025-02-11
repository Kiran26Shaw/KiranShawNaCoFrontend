document.addEventListener("DOMContentLoaded", () => {
    async function fetchProducts() {
        try {
            const response = await fetch("https://fakestoreapi.com/products");
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    function displayProducts(products) {
        const productList = document.getElementById("product-list");
        productList.innerHTML = "";
        products.forEach(product => {
            productList.innerHTML += `
                <div class="col">
                    <div class="card h-100">
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

        attachAddToCartEvent();
    }

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

    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        document.getElementById("cart-count").textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    }

    function showCartNotification(title) {
        const cartToggler = document.getElementById("cart-toggler");
        cartToggler.textContent = `${title} added to cart!`;
        cartToggler.classList.add("show");
        setTimeout(() => cartToggler.classList.remove("show"), 2000);
    }

    fetchProducts();
    updateCartCount();
});

// Cart Page Functionality
// document.addEventListener("DOMContentLoaded", () => {
//     const cartItemsContainer = document.getElementById("cart-items");
//     const subtotalElement = document.getElementById("subtotal");
//     const taxElement = document.getElementById("tax");
//     const totalElement = document.getElementById("total");

//     let cart = JSON.parse(localStorage.getItem("cart")) || [];

//     function renderCart() {
//         cartItemsContainer.innerHTML = "";
//         if (cart.length === 0) {
//             cartItemsContainer.innerHTML = "<tr><td colspan='3' class='text-center'>Your cart is empty!</td></tr>";
//             updateSummary(0);
//             return;
//         }

//         let subtotal = 0;
//         cart.forEach(item => {
//             const itemTotal = item.price * item.quantity;
//             subtotal += itemTotal;

//             const row = document.createElement("tr");
//             row.innerHTML = `
//                 <td>
//                     <img src="${item.image}" alt="${item.title}" class="cart-img">
//                     <div>
//                         <p>${item.title}</p>
//                         <small class="text-danger">Price: $${item.price.toFixed(2)}</small><br>
//                         <a href="#" class="text-danger remove-item" data-id="${item.id}">Remove</a>
//                     </div>
//                 </td>
//                 <td>
//                     <input type="number" class="form-control quantity-input" data-id="${item.id}" min="1" value="${item.quantity}">
//                 </td>
//                 <td>$${itemTotal.toFixed(2)}</td>
//             `;

//             cartItemsContainer.appendChild(row);
//         });

//         updateSummary(subtotal);
//         attachEventListeners();
//     }

//     function updateSummary(subtotal) {
//         const tax = subtotal * 0.175; // 17.5% tax
//         const total = subtotal + tax;

//         subtotalElement.textContent = subtotal.toFixed(2);
//         taxElement.textContent = tax.toFixed(2);
//         totalElement.textContent = total.toFixed(2);
//     }

//     function attachEventListeners() {
//         document.querySelectorAll(".quantity-input").forEach(input => {
//             input.addEventListener("change", (event) => {
//                 const id = event.target.dataset.id;
//                 let newQuantity = parseInt(event.target.value);

//                 if (newQuantity < 1 || isNaN(newQuantity)) {
//                     event.target.value = 1;
//                     newQuantity = 1;
//                 }

//                 cart = cart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item);
//                 localStorage.setItem("cart", JSON.stringify(cart));
//                 renderCart();
//             });
//         });

//         document.querySelectorAll(".remove-item").forEach(button => {
//             button.addEventListener("click", (event) => {
//                 event.preventDefault();
//                 const id = event.target.dataset.id;
//                 cart = cart.filter(item => item.id !== id);
//                 localStorage.setItem("cart", JSON.stringify(cart));
//                 renderCart();
//                 updateCartCount();
//             });
//         });
//     }

//     renderCart();
// });
document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");
    const cartToggler = document.getElementById("cart-toggler");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function showToggler(message) {
        cartToggler.textContent = message;
        cartToggler.style.display = "block";
        setTimeout(() => {
            cartToggler.style.display = "none";
        }, 1500);
    }

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
                    <input type="number" class="form-control quantity-input" data-id="${item.id}" min="1" value="${item.quantity}">
                </td>
                <td>$${itemTotal.toFixed(2)}</td>
            `;

            cartItemsContainer.appendChild(row);
        });

        updateSummary(subtotal);
        attachEventListeners();
    }

    function updateSummary(subtotal) {
        const tax = subtotal * 0.175; // 17.5% tax
        const total = subtotal + tax;

        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    function attachEventListeners() {
        document.querySelectorAll(".quantity-input").forEach(input => {
            input.addEventListener("change", (event) => {
                const id = event.target.dataset.id;
                const newQuantity = parseInt(event.target.value);
                if (newQuantity > 0) {
                    cart = cart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    renderCart();
                    showToggler("Quantity Updated!");
                }
            });
        });

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const id = event.target.dataset.id;
                cart = cart.filter(item => item.id !== id);
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
                showToggler("Item Removed!");
            });
        });
    }

    renderCart();
});
