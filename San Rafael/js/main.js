// ── NAV SCROLL ──
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ── MOBILE NAV ──
const hamburger    = document.querySelector('.hamburger');
const mobileNav    = document.querySelector('.mobile-nav');
const mobileClose  = document.querySelector('.mobile-close');

hamburger?.addEventListener('click', () => {
  mobileNav?.classList.add('open');
  document.body.style.overflow = 'hidden';
});
mobileClose?.addEventListener('click', closeMobileNav);
mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));
function closeMobileNav() {
  mobileNav?.classList.remove('open');
  document.body.style.overflow = '';
}

// ── CART ──
const cartState = { items: [] };

const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartBadge   = document.getElementById('cartBadge');
const cartItems   = document.getElementById('cartItems');
const cartTotal   = document.getElementById('cartTotal');

document.getElementById('cartBtn')?.addEventListener('click', openCart);
cartOverlay?.addEventListener('click', closeCart);
document.getElementById('cartClose')?.addEventListener('click', closeCart);

function openCart() {
  cartSidebar?.classList.add('open');
  cartOverlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  cartSidebar?.classList.remove('open');
  cartOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

window.addToCart = function(name, price, emoji) {
  const found = cartState.items.find(i => i.name === name);
  if (found) { found.qty++; }
  else { cartState.items.push({ name, price: parseFloat(price), emoji, qty: 1 }); }
  renderCart();
  openCart();
  showToast(`${name} added to cart`);
};

window.changeQty = function(idx, delta) {
  cartState.items[idx].qty += delta;
  if (cartState.items[idx].qty <= 0) cartState.items.splice(idx, 1);
  renderCart();
};

window.removeItem = function(idx) {
  cartState.items.splice(idx, 1);
  renderCart();
};

function renderCart() {
  if (!cartItems) return;
  const totalQty = cartState.items.reduce((s, i) => s + i.qty, 0);
  const totalAmt = cartState.items.reduce((s, i) => s + i.price * i.qty, 0);

  if (cartBadge) {
    cartBadge.textContent = totalQty;
    cartBadge.style.display = totalQty > 0 ? 'flex' : 'none';
  }
  if (cartTotal) cartTotal.textContent = `$${totalAmt.toFixed(2)}`;

  if (cartState.items.length === 0) {
    cartItems.innerHTML = `<div class="cart-empty"><span style="font-size:2rem">🛒</span>Your cart is empty</div>`;
    return;
  }
  cartItems.innerHTML = cartState.items.map((item, i) => `
    <div class="cart-item">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">$${item.price.toFixed(2)}</div>
        <div class="ci-row">
          <button class="qty-btn" onclick="changeQty(${i},-1)">−</button>
          <span class="qty-n">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${i},1)">+</button>
          <span class="ci-rm" onclick="removeItem(${i})">Remove</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ── TOAST ──
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = `
      position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(80px);
      background:#22252a;border:1px solid rgba(201,149,108,.3);
      color:#f2ede8;padding:.7rem 1.5rem;border-radius:2px;
      font-size:.82rem;z-index:3000;transition:transform .3s cubic-bezier(.4,0,.2,1);
      font-family:Inter,system-ui,sans-serif;white-space:nowrap;
    `;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.transform = 'translateX(-50%) translateY(80px)'; }, 2500);
}

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ── SHOP FILTERS ──
document.querySelectorAll('.filter-list li').forEach(li => {
  li.addEventListener('click', () => {
    li.closest('.filter-list').querySelectorAll('li').forEach(i => i.classList.remove('active'));
    li.classList.add('active');
    const filter = li.dataset.filter;
    let shown = 0;
    document.querySelectorAll('.product-card').forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
      if (match) shown++;
    });
    const countEl = document.getElementById('shopCount');
    if (countEl) countEl.textContent = `${shown} product${shown !== 1 ? 's' : ''}`;
  });
});

// ── SCROLL ANIMATIONS ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── CONTACT FORM ──
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('[type=submit]');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Message Sent ✓';
    showToast('Your message has been sent!');
    e.target.reset();
    setTimeout(() => { btn.textContent = 'Send Message'; btn.disabled = false; }, 3000);
  }, 1200);
});

// ── INIT ──
renderCart();
