const cart = {};
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const drawer = document.querySelector('.cart-drawer');
const drawerBackdrop = document.querySelector('.cart-backdrop');
const drawerToggles = document.querySelectorAll('[data-cart-toggle], [data-cart-close]');
const cartItems = document.querySelector('[data-cart-items]');
const cartCounts = document.querySelectorAll('[data-cart-total-count]');
const cartSubtotal = document.querySelector('[data-cart-subtotal]');
const checkoutButton = document.querySelector('[data-open-checkout]');
const checkoutModal = document.querySelector('.checkout-modal');
const checkoutForm = document.querySelector('[data-checkout-form]');
const checkoutSuccess = document.querySelector('[data-checkout-success]');

function cartEntries() {
  return Object.values(cart).filter((item) => item.quantity > 0);
}

function cartTotals() {
  return cartEntries().reduce((totals, item) => ({
    quantity: totals.quantity + item.quantity,
    price: totals.price + item.price * item.quantity,
  }), { quantity: 0, price: 0 });
}

function renderCart() {
  const entries = cartEntries();
  const totals = cartTotals();
  cartCounts.forEach((count) => { count.textContent = totals.quantity; });
  cartSubtotal.textContent = money.format(totals.price);
  checkoutButton.disabled = totals.quantity === 0;

  if (!entries.length) {
    cartItems.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.<br />Escolha uma quentinha para começar.</p>';
    return;
  }

  cartItems.innerHTML = entries.map((item) => `
    <article class="cart-line">
      <div><strong>${item.name}</strong><small>${money.format(item.price)} cada</small></div>
      <div class="cart-quantity"><button type="button" data-cart-change="-1" data-product-id="${item.id}" aria-label="Remover uma unidade">−</button><b>${item.quantity}</b><button type="button" data-cart-change="1" data-product-id="${item.id}" aria-label="Adicionar uma unidade">+</button></div>
    </article>`).join('');
}

function changeCart(id, change) {
  if (!cart[id]) return;
  cart[id].quantity = Math.max(0, cart[id].quantity + change);
  renderCart();
}

function toggleDrawer(force) {
  const shouldOpen = typeof force === 'boolean' ? force : !drawer.classList.contains('open');
  drawer.classList.toggle('open', shouldOpen);
  drawerBackdrop.classList.toggle('open', shouldOpen);
  drawer.setAttribute('aria-hidden', String(!shouldOpen));
  document.querySelectorAll('[data-cart-toggle]').forEach((toggle) => toggle.setAttribute('aria-expanded', String(shouldOpen)));
}

document.querySelectorAll('[data-add]').forEach((button) => {
  button.addEventListener('click', () => {
    const { productId: id, productName: name, productPrice } = button.dataset;
    if (!cart[id]) cart[id] = { id, name, price: Number(productPrice), quantity: 0 };
    cart[id].quantity += 1;
    renderCart();
    toggleDrawer(true);
  });
});

cartItems.addEventListener('click', (event) => {
  const button = event.target.closest('[data-cart-change]');
  if (button) changeCart(button.dataset.productId, Number(button.dataset.cartChange));
});

drawerToggles.forEach((button) => button.addEventListener('click', () => toggleDrawer()));

checkoutButton.addEventListener('click', () => {
  if (checkoutButton.disabled) return;
  toggleDrawer(false);
  checkoutForm.hidden = false;
  checkoutSuccess.hidden = true;
  checkoutModal.showModal();
});

document.querySelectorAll('[data-checkout-close]').forEach((button) => {
  button.addEventListener('click', () => checkoutModal.close());
});

checkoutModal.addEventListener('click', (event) => {
  if (event.target === checkoutModal) checkoutModal.close();
});

document.querySelector('#order-form').addEventListener('submit', (event) => {
  event.preventDefault();
  checkoutForm.hidden = true;
  checkoutSuccess.hidden = false;
  Object.keys(cart).forEach((id) => { cart[id].quantity = 0; });
  renderCart();
});

document.querySelector('.menu-toggle').addEventListener('click', (event) => {
  const menuButton = event.currentTarget;
  const nav = document.querySelector('.main-nav');
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('open', !isOpen);
});

renderCart();
