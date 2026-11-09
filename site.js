const modal = document.querySelector('.order-modal');
const closeModal = document.querySelector('.modal-close');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const counts = { quentinha: 0, churrasco: 0, sobremesa: 0 };
const menuStep = document.querySelector('.step-menu');
const checkoutStep = document.querySelector('.step-checkout');
const successStep = document.querySelector('.step-success');

function totalItems() {
  return Object.values(counts).reduce((total, count) => total + count, 0);
}

function updateCart() {
  Object.entries(counts).forEach(([item, count]) => {
    document.querySelector(`[data-count="${item}"]`).textContent = count;
  });
  document.querySelector('[data-cart-count]').textContent = totalItems();
}

function showStep(step) {
  [menuStep, checkoutStep, successStep].forEach((element) => element.classList.remove('active'));
  step.classList.add('active');
}

document.querySelectorAll('.js-order').forEach((button) => {
  button.addEventListener('click', () => {
    showStep(menuStep);
    modal.showModal();
  });
});

document.querySelectorAll('[data-change]').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.dataset.item;
    const change = Number(button.dataset.change);
    counts[item] = Math.max(0, counts[item] + change);
    updateCart();
  });
});

document.querySelector('.js-checkout').addEventListener('click', () => {
  if (totalItems() === 0) {
    const hint = document.querySelector('[data-cart-count]');
    hint.animate([{ color: '#c7392e', transform: 'scale(1.25)' }, { color: '', transform: 'scale(1)' }], { duration: 450 });
    return;
  }
  showStep(checkoutStep);
});

document.querySelector('.back-step').addEventListener('click', () => showStep(menuStep));

document.querySelector('#checkout-form').addEventListener('submit', (event) => {
  event.preventDefault();
  showStep(successStep);
});

document.querySelector('.js-close-success').addEventListener('click', () => modal.close());
closeModal.addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('open', !isOpen);
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  });
});

updateCart();
