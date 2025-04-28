const products = [
  { id: 1, name: "Smartphone", price: 15999, description: "Latest smartphone with high-end features", image: "images/Phone.jpg" },
  { id: 2, name: "Laptop", price: 45999, description: "Powerful laptop for work and gaming", image: "images/Laptop.jpg" },
  { id: 3, name: "Headphones", price: 1999, description: "Wireless headphones with noise cancellation", image: "images/Headphone.jpg" },
  { id: 4, name: "Smartwatch", price: 3499, description: "Track your fitness and stay connected", image: "images/Smartwatch.jpg" },
  { id: 5, name: "Camera", price: 28999, description: "Capture your memories in high resolution", image: "images/Camera.jpg" },
  { id: 6, name: "Bluetooth Speaker", price: 1299, description: "Portable speaker with amazing sound quality", image: "images/Speaker.jpg" },
];

const formatPrice = price => "₹" + price.toLocaleString("en-IN");
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

const updateCartCount = () => {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = cart.reduce((a, b) => a + b.quantity, 0);
};

const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
};

const displayProducts = () => {
  const container = document.getElementById("products-container");
  if (!container) return;
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}" class="product-image">
      <div class="product-info">
        <h3 class="product-title">${p.name}</h3>
        <p class="product-price">${formatPrice(p.price)}</p>
        <p class="product-description">${p.description}</p>
        <button class="btn add-to-cart-btn" data-id="${p.id}">Add to Cart</button>
      </div>
    </div>`).join('');
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => btn.onclick = addToCart);
};

const addToCart = e => {
  const id = +e.target.dataset.id;
  const item = cart.find(i => i.id === id);
  item ? item.quantity++ : cart.push({ ...products.find(p => p.id === id), quantity: 1 });
  saveCart();
  alert("Added to cart!");
};

const displayCart = () => {
  const items = document.getElementById("cart-items");
  const summary = document.getElementById("cart-summary");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  if (!items) return;

  if (!cart.length) {
    items.innerHTML = `<div class="empty-cart"><p>Your cart is empty</p><a href="products.html" class="btn">Continue Shopping</a></div>`;
    summary.style.display = "none";
    return;
  }

  summary.style.display = "block";
  let subtotal = 0;
  items.innerHTML = cart.map(i => {
    const total = i.price * i.quantity;
    subtotal += total;
    return `
    <div class="cart-item">
      <img src="${i.image}" alt="${i.name}">
      <div class="cart-item-info">
        <h3>${i.name}</h3>
        <p>${formatPrice(i.price)}</p>
        <div class="cart-item-quantity">
          <button class="quantity-btn" onclick="changeQty(${i.id},-1)">-</button>
          <input type="number" value="${i.quantity}" min="1" onchange="setQty(${i.id},this.value)">
          <button class="quantity-btn" onclick="changeQty(${i.id},1)">+</button>
        </div>
        <p>Total: ${formatPrice(total)}</p>
        <button class="remove-btn" onclick="removeItem(${i.id})">Remove</button>
      </div>
    </div>`;
  }).join('');

  subtotalEl.textContent = formatPrice(subtotal);
  totalEl.textContent = formatPrice(subtotal + (subtotal ? 50 : 0));
};

const changeQty = (id, delta) => {
  const item = cart.find(i => i.id === id);
  if (item) item.quantity = Math.max(1, item.quantity + delta);
  saveCart();
  displayCart();
};

const setQty = (id, val) => {
  const item = cart.find(i => i.id === id);
  if (item) item.quantity = Math.max(1, +val);
  saveCart();
  displayCart();
};

const removeItem = id => {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  displayCart();
};

const setupCheckout = () => {
  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutModal = document.getElementById("checkout-modal");
  const confirmationModal = document.getElementById("confirmation-modal");
  const checkoutForm = document.getElementById("checkout-form");

  checkoutBtn?.addEventListener("click", () => checkoutModal.style.display = "block");
  document.querySelectorAll(".close-btn").forEach(btn => btn.onclick = () => {
    checkoutModal.style.display = confirmationModal.style.display = "none";
  });

  checkoutForm?.addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("order-id").textContent = "ORD-" + Math.floor(Math.random() * 1e6);
    checkoutModal.style.display = "none";
    confirmationModal.style.display = "block";
    cart = [];
    saveCart();
  });
};

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  displayProducts();
  displayCart();
  setupCheckout();
});
