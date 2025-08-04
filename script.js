// Получаем элементы страницы
const servicesPage = document.getElementById('services-page');
const plansPage = document.getElementById('plans-page');
const optionsPage = document.getElementById('options-page');
const cartPage = document.getElementById('cart-page');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const totalPrice = document.getElementById('total-price');
const cartIcon = document.getElementById('cart-icon');
const mainLogo = document.getElementById('main-logo');

// Элементы кнопок "Назад"
const backToServicesBtn = document.getElementById('back-to-services');
const backToPlansBtn = document.getElementById('back-to-plans');
const backToMainBtn = document.getElementById('back-to-main');

// Текущий выбор
let currentService = null;
let currentPlan = null;

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// История страниц
const pageHistory = [];

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    setupEventListeners();
});

function addToCart(item) {
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert('Товар додано до корзини!');
}

function updateCartCount() {
    cartCount.textContent = cart.length;
}

function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    page.classList.add('active');
    
    // Сохраняем историю только для основных страниц
    if (page !== servicesPage) {
        pageHistory.push(page);
    }
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
    backToServicesBtn.addEventListener('click', () => goBackToPage(servicesPage));
    backToPlansBtn.addEventListener('click', () => goBackToPage(plansPage));
    backToMainBtn.addEventListener('click', goBack);
    
    // Обработчик для логотипа
    mainLogo.addEventListener('click', goToHome);
    
    // Обработчик для закрытия меню по клику вне контента
    document.getElementById('order-menu').addEventListener('click', (e) => {
        if (e.target === document.getElementById('order-menu')) {
            closeOrderMenu();
        }
    });
}

function goToHome() {
    // Очищаем историю и показываем главную страницу
    pageHistory.length = 0;
    showPage(servicesPage);
}

// Новая функция для возврата к конкретной странице
function goBackToPage(page) {
    showPage(page);
}

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
        
        // Добавляем обработчик для кнопки
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
        
        // Добавляем обработчик для кнопки
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
    
    // Обработчик для кнопки оформления заказа
    document.querySelector('.checkout-btn').addEventListener('click', checkout);
}

function goBack() {
    if (pageHistory.length > 0) {
        const prevPage = pageHistory.pop();
        showPage(prevPage);
    } else {
        showPage(servicesPage);
    }
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
    
    // Обработчики для кнопок в меню
    document.querySelector('.remove-btn').addEventListener('click', removeFromCart);
    document.querySelector('.order-btn').addEventListener('click', orderSingleItem);
    document.querySelector('.close-btn').addEventListener('click', closeOrderMenu);
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
}

function orderSingleItem() {
    const index = document.getElementById('order-menu').dataset.index;
    const item = cart[index];
    createOrder([item]);
}

function checkout() {
    if (cart.length === 0) {
        alert('Корзина порожня!');
        return;
    }
    createOrder(cart);
}

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
