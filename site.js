const modal = document.querySelector('.order-modal');
const closeModal = document.querySelector('.modal-close');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

document.querySelectorAll('.js-order').forEach((button) => {
  button.addEventListener('click', () => modal.showModal());
});

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
