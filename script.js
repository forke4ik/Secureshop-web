// ========== ЭЛЕМЕНТЫ СТРАНИЦЫ ========== //
const servicesPage = document.getElementById('services-page');
const plansPage = document.getElementById('plans-page');
const optionsPage = document.getElementById('options-page');
const cartPage = document.getElementById('cart-page');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const totalPrice = document.getElementById('total-price');
const cartIcon = document.getElementById('cart-icon');
const checkoutBtn = document.getElementById('checkout-btn');
const removeBtn = document.getElementById('remove-btn');
const orderBtn = document.getElementById('order-btn');
const closeBtn = document.getElementById('close-btn');
const backButton1 = document.getElementById('back-button-1');
const backButton2 = document.getElementById('back-button-2');
const backButton3 = document.getElementById('back-button-3');

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ========== //
let currentService = null;
let currentPlan = null;

// ========== ДАННЫЕ О ПРОДУКТАХ ========== //
const products = {
  chatgpt: {
    name: "ChatGPT",
    logo: "./images/chatgpt.webp",
    plans: [
      {
        id: "chatgpt_plus",
        name: "Plus",
        description: "Доступ до GPT-4, розширені можливості",
        options: [
          { period: "1 місяць", price: 650 },
          { period: "3 місяці", price: 1800 },
          { period: "12 місяців", price: 6500 }
        ]
      }
    ]
  },
  discord: {
    name: "Discord",
    logo: "./images/discord.webp",
    plans: [
      {
        id: "discord_basic",
        name: "Nitro Basic",
        description: "Базові можливості Nitro",
        options: [
          { period: "1 місяць", price: 100 },
          { period: "12 місяців", price: 900 }
        ]
      },
      {
        id: "discord_full",
        name: "Nitro Full",
        description: "Повна версія з усіма функціями",
        options: [
          { period: "1 місяць", price: 170 },
          { period: "12 місяців", price: 1700 }
        ]
      }
    ]
  },
  duolingo: {
    name: "Duolingo",
    logo: "./images/duolingo.webp",
    plans: [
      {
        id: "duolingo_individual",
        name: "Individual",
        description: "Преміум для одного користувача",
        options: [
          { period: "1 місяць", price: 200 },
          { period: "12 місяців", price: 1500 }
        ]
      },
      {
        id: "duolingo_family",
        name: "Family",
        description: "Для всієї родини (до 5 осіб)",
        options: [
          { period: "12 місяців", price: 380 }
        ]
      }
    ]
  },
  picsart: {
    name: "PicsArt",
    logo: "./images/picsart.webp",
    plans: [
      {
        id: "picsart_plus",
        name: "Plus",
        description: "Розширені інструменти",
        options: [
          { period: "1 місяць", price: 130 },
          { period: "12 місяців", price: 800 }
        ]
      },
      {
        id: "picsart_pro",
        name: "Pro",
        description: "Професійні можливості",
        options: [
          { period: "1 місяць", price: 180 },
          { period: "12 місяців", price: 1000 }
        ]
      }
    ]
  }
};

// ========== КОРЗИНА ========== //
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ========== ИНИЦИАЛИЗАЦИЯ ========== //
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    updateCartCount();
    setupEventListeners();
    checkImages();
}

function checkImages() {
    document.querySelectorAll('img').forEach(img => {
        if (!img.complete || img.naturalHeight === 0) {
            img.dispatchEvent(new Event('error'));
        }
    });
}

// ========== ФУНКЦИИ КОРЗИНЫ ========== //
function addToCart(item) {
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast('Товар додано до корзини!');
}

function updateCartCount() {
    cartCount.textContent = cart.length;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// ========== НАВИГАЦИЯ ========== //
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    page.classList.add('active');
    window.scrollTo(0, 0);
}

function setupEventListeners() {
    // Обработчики для сервисов
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const serviceId = card.dataset.service;
            selectService(serviceId);
        });
    });
    
    // Обработчик для иконки корзины
    cartIcon.addEventListener('click', showCart);
    
    // Обработчики для кнопок "Назад"
    backButton1.addEventListener('click', () => showPage(servicesPage));
    backButton2.addEventListener('click', () => showPage(plansPage));
    backButton3.addEventListener('click', () => showPage(servicesPage));
    
    // Обработчики для меню заказа
    closeBtn.addEventListener('click', closeOrderMenu);
    removeBtn.addEventListener('click', removeFromCart);
    orderBtn.addEventListener('click', orderSingleItem);
    checkoutBtn.addEventListener('click', checkout);
}

// ========== ВЫБОР ТОВАРОВ ========== //
function selectService(serviceId) {
    currentService = products[serviceId];
    document.getElementById('service-name').textContent = currentService.name;
    
    const plansContainer = document.getElementById('plans-container');
    plansContainer.innerHTML = '';
    
    currentService.plans.forEach(plan => {
        const planCard = document.createElement('div');
        planCard.className = 'plan-card';
        planCard.innerHTML = `
            <h2>${plan.name}</h2>
            <p>${plan.description}</p>
            <button class="add-to-cart">Обрати</button>
        `;
        plansContainer.appendChild(planCard);
        
        // Обработчик для кнопки выбора тарифа
        planCard.querySelector('button').addEventListener('click', () => {
            selectPlan(plan.id);
        });
    });
    
    showPage(plansPage);
}

function selectPlan(planId) {
    currentPlan = currentService.plans.find(plan => plan.id === planId);
    document.getElementById('plan-name').textContent = `${currentService.name} ${currentPlan.name}`;
    document.getElementById('plan-description').textContent = currentPlan.description;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    currentPlan.options.forEach(option => {
        const optionCard = document.createElement('div');
        optionCard.className = 'option-card';
        optionCard.innerHTML = `
            <div class="period">${option.period}</div>
            <div class="price">${option.price} UAH</div>
            <button class="add-to-cart">Додати в корзину</button>
        `;
        optionsContainer.appendChild(optionCard);
        
        // Обработчик для кнопки добавления в корзину
        optionCard.querySelector('button').addEventListener('click', () => {
            addItemToCart(option.period, option.price);
        });
    });
    
    showPage(optionsPage);
}

function addItemToCart(period, price) {
    const item = {
        service: currentService.name,
        plan: currentPlan.name,
        period,
        price
    };
    
    addToCart(item);
}

// ========== УПРАВЛЕНИЕ КОРЗИНОЙ ========== //
function showCart() {
    updateCartView();
    showPage(cartPage);
}

function updateCartView() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Ваша корзина порожня</p>';
        totalPrice.textContent = '0';
        return;
    }
    
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h3>${item.service} ${item.plan}</h3>
                <p>${item.period}</p>
            </div>
            <div class="cart-item-price">${item.price} UAH</div>
            <div class="cart-item-arrow">
                <i class="fas fa-chevron-right"></i>
            </div>
        `;
        
        cartItem.addEventListener('click', () => showOrderMenu(index));
        cartItems.appendChild(cartItem);
    });
    
    totalPrice.textContent = total;
}

function showOrderMenu(index) {
    const item = cart[index];
    document.getElementById('order-item-title').textContent = `${item.service} ${item.plan}`;
    document.getElementById('order-service').textContent = item.service;
    document.getElementById('order-plan').textContent = item.plan;
    document.getElementById('order-period').textContent = item.period;
    document.getElementById('order-price').textContent = item.price;
    
    document.getElementById('order-menu').dataset.index = index;
    document.getElementById('order-menu').classList.add('active');
}

function closeOrderMenu() {
    document.getElementById('order-menu').classList.remove('active');
}

function removeFromCart() {
    const index = document.getElementById('order-menu').dataset.index;
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartView();
    closeOrderMenu();
    showToast('Товар видалено з корзини');
}

function orderSingleItem() {
    const index = document.getElementById('order-menu').dataset.index;
    const item = cart[index];
    createOrder([item]);
}

function checkout() {
    if (cart.length === 0) {
        showToast('Корзина порожня!');
        return;
    }
    createOrder(cart);
}

// ========== ОФОРМЛЕНИЕ ЗАКАЗА ========== //
function createOrder(items) {
    let message = "🛒 Моє замовлення:\n\n";
    
    items.forEach(item => {
        message += `▫️ ${item.service} ${item.plan} (${item.period}) - ${item.price} UAH\n`;
    });
    
    const total = items.reduce((sum, item) => sum + item.price, 0);
    message += `\n💳 Всього: ${total} UAH`;
    
    const encodedMessage = encodeURIComponent(message);
    const botUsername = "SecureShopBot";
    const telegramUrl = `https://t.me/${botUsername}?start=${encodedMessage}`;
    window.open(telegramUrl, '_blank');
}
