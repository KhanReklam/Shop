// =================== CONFIG ===================
const BASE_URL = 'https://test-38fd9-default-rtdb.asia-southeast1.firebasedatabase.app';
const WHATSAPP_PHONE = "515935433";

// =================== GLOBAL STATE ===================
const loader = document.getElementById('loader');
const categories = [];
const products = {};
let firstNavLink = null;
let lastActiveId = null;

// =================== DOM HELPERS ===================
const DOM = {
    navbar: () => document.getElementById("category-navbar"),
    container: () => document.getElementById("product-container"),
    popup: () => document.getElementById("order-popup"),
    openBtn: () => document.getElementById("open-order-popup"),
    closeBtn: () => document.querySelector(".close-popup"),
    orderBox: () => document.getElementById("order-items"),
    totalDiv: () => document.getElementById("order-total"),
    sendBtn: () => document.getElementById("send-whatsapp"),
};

// =================== FETCH DATA ===================
function fetchData() {
    const cats = fetch(`${BASE_URL}/categories.json`).then(r => r.json());
    const prods = fetch(`${BASE_URL}/products.json`).then(r => r.json());
    return Promise.all([cats, prods]);
}

fetchData()
    .then(([catsData, prodsData]) => {
        categories.push(...catsData);
        Object.assign(products, prodsData);

        setTimeout(() => {
            loader.remove();
            DOM.openBtn().style.display = 'none';
            firstNavLink = initializeNavbar();
            filterProducts('all');
        }, 2000);

    })
    .catch(err => {
        loader.textContent = 'Xəta baş verdi';
        console.error(err);
    });

// =================== STICKY HEIGHT ===================
function getStickyHeight() {
    if (window.innerWidth <= 480) return 64;
    const h = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--sticky-height'));
    return isNaN(h) ? 50 : h;
}

// =================== OBSERVER & ANIMATIONS ===================
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            scrollObserver.unobserve(entry.target); // Only animate once
        }
    });
}, { threshold: 0.1 });

// =================== FILTER PRODUCTS ===================
function filterProducts(categoryId) {
    const container = DOM.container();
    container.innerHTML = '';

    const cats = categoryId === 'all'
        ? categories
        : categories.filter(c => c.id === categoryId);

    let globalDelay = 0;

    cats.forEach(category => {
        const section = document.createElement('div');
        section.className = 'category-section';
        section.id = category.id;

        const h2 = document.createElement('h2');
        h2.textContent = category.name;
        section.appendChild(h2);

        products[category.id].forEach((p, index) => {
            const card = createProductCard(p);

            // Stagger effect
            card.style.animation = `slideUpFade 0.5s ease backwards ${globalDelay * 0.05}s`;
            globalDelay++;

            // Also attach scroll reveal for standard scrolling (if animations finish)
            card.classList.add('reveal-item');
            scrollObserver.observe(card);

            section.appendChild(card);
        });

        container.appendChild(section);
    });

    initCategoryObserver();
}

// =================== NAVBAR ===================
function activateNavLink(anchor) {
    if (lastActiveId === anchor.dataset.target) return;
    lastActiveId = anchor.dataset.target;

    document.querySelectorAll('.category-btn').forEach(b => {
        b.classList.remove('active');
        b.removeAttribute('aria-current');
    });

    anchor.classList.add('active');
    anchor.setAttribute('aria-current', 'true');

    anchor.scrollIntoView({
        inline: 'center',
        behavior: 'smooth',
        block: 'nearest'
    });
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
        top: top - getStickyHeight() + 8,
        behavior: 'smooth'
    });
}

function initializeNavbar() {
    const navbar = DOM.navbar();

    categories.forEach(cat => {
        const a = document.createElement('a');
        a.className = 'category-btn';
        a.textContent = cat.name;
        a.dataset.target = cat.id;
        a.href = '#';

        a.addEventListener('click', e => {
            e.preventDefault();
            activateNavLink(a);
            filterProducts(cat.id);
            scrollToSection(cat.id);
            showAllButton();
        });

        navbar.appendChild(a);
    });

    return navbar.querySelector('.category-btn');
}

function showAllButton() {
    const navbar = DOM.navbar();
    if (navbar.querySelector('[data-target="all"]')) return;

    const all = document.createElement('a');
    all.className = 'category-btn';
    all.textContent = 'Hamısı';
    all.dataset.target = 'all';
    all.href = '#';

    all.addEventListener('click', e => {
        e.preventDefault();
        activateNavLink(all);
        filterProducts('all');
        all.remove();
    });

    navbar.prepend(all);
}

// =================== PRODUCT CARD ===================
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${product.img}" class="clickable-img" style="cursor: zoom-in;">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
        <p class="price">Qiymət: ${product.price} AZN</p>
      </div>
      <div class="countContainer">
        <button class="minus">−</button>
        <span class="count">${product.quantity}</span>
        <button class="plus">+</button>
      </div>
    `;

    // Lightbox Trigger
    const img = card.querySelector('img');
    img.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.openLightbox) window.openLightbox(product.img);
    });

    const countSpan = card.querySelector('.count');

    const updateQty = delta => {
        if (delta < 0 && product.quantity === 0) return;
        product.quantity += delta;
        countSpan.textContent = product.quantity;
        updateOrderList();

        // Cart Bump Animation
        if (delta > 0) {
            const btn = DOM.openBtn();
            btn.classList.remove('cart-bump');
            void btn.offsetWidth; // Trigger reflow
            btn.classList.add('cart-bump');
        }
    };

    card.querySelector('.plus').addEventListener('click', e => {
        e.stopPropagation();
        updateQty(1);
    });

    card.querySelector('.minus').addEventListener('click', e => {
        e.stopPropagation();
        updateQty(-1);
    });

    return card;
}

// =================== OBSERVER ===================
function getObserverThreshold() {
    return window.innerWidth <= 480 ? [0.25, 0.5] : [0, 0.25, 0.5, 0.75, 1];
}

function initCategoryObserver() {
    const visibility = new Map();

    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => visibility.set(e.target.id, e.intersectionRatio));

        let bestId = null;
        let bestRatio = 0;
        for (const [id, ratio] of visibility) {
            if (ratio > bestRatio) {
                bestRatio = ratio;
                bestId = id;
            }
        }

        if (bestId) {
            document.querySelectorAll('.category-btn').forEach(btn => {
                if (btn.dataset.target === bestId) activateNavLink(btn);
            });
        }
    }, {
        threshold: getObserverThreshold(),
        rootMargin: `-${getStickyHeight() / 2}px 0px`
    });

    document.querySelectorAll('.category-section').forEach(sec => {
        visibility.set(sec.id, 0);
        observer.observe(sec);
    });
}

// =================== POPUP ===================
function initializePopup() {
    const popup = DOM.popup();

    const close = () => {
        popup.classList.remove('open');
        setTimeout(() => {
            popup.style.display = 'none';
            document.body.style.overflow = '';
        }, 300); // Wait for transition
    };

    DOM.openBtn().addEventListener('click', () => {
        updateOrderList();
        popup.style.display = 'flex';
        // Force reflow
        popup.offsetHeight;
        popup.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    DOM.closeBtn().addEventListener('click', close);
    popup.addEventListener('click', e => e.target === popup && close());
}
initializePopup();

// =================== ORDER ===================
function calculateOrderTotal() {
    let total = 0;
    const items = [];

    for (const cat in products) {
        products[cat].forEach(p => {
            if (p.quantity > 0) {
                const sum = p.quantity * p.price;
                total += sum;
                items.push({ ...p, itemTotal: sum });
            }
        });
    }
    return { items, total };
}

function updateOrderList() {
    const data = calculateOrderTotal();
    const box = DOM.orderBox();
    const openBtn = DOM.openBtn();

    box.innerHTML = '';

    if (!data.items.length) {
        DOM.totalDiv().textContent = 'Ümumi məbləğ: 0.00 AZN';
        openBtn.style.display = 'none';
        return;
    }

    openBtn.style.display = 'flex';

    data.items.forEach(i => {
        box.innerHTML += `<div><span>${i.name} x ${i.quantity}</span><span>${i.itemTotal.toFixed(2)} AZN</span></div>`;
    });

    DOM.totalDiv().textContent = `Ümumi məbləğ: ${data.total.toFixed(2)} AZN`;
}

// =================== WHATSAPP ===================
function formatOrderMessage(data) {
    return `*Sifariş siyahısı:*\n\n` +
        data.items.map(i => `${i.name} x ${i.quantity} — ${i.itemTotal.toFixed(2)} AZN`).join('\n') +
        `\n\nÜmumi məbləğ: ${data.total.toFixed(2)} AZN`;
}

function sendOrderViaWhatsApp() {
    const btn = DOM.sendBtn();
    btn.disabled = true;

    const data = calculateOrderTotal();
    if (!data.items.length) {
        alert('Səbətiniz boşdur!');
        btn.disabled = false;
        return;
    }

    window.open(
        `https://wa.me/994${WHATSAPP_PHONE}?text=${encodeURIComponent(formatOrderMessage(data))}`,
        '_blank'
    );

    setTimeout(() => btn.disabled = false, 1500);
}

DOM.sendBtn().addEventListener('click', sendOrderViaWhatsApp);

// =================== LIGHTBOX LOGIC ===================
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');
const lightboxClose = lightbox.querySelector('.lightbox-close');

window.openLightbox = function (src) {
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
    // Reflow
    lightbox.offsetHeight;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

window.closeLightbox = function () {
    lightbox.classList.remove('active');
    setTimeout(() => {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) window.closeLightbox();
});

lightboxClose.addEventListener('click', window.closeLightbox);