// Загрузка данных о товарах
import { products, addToCart, cart } from './products.js';

// Элементы страниц
const servicesPage = document.getElementById('services-page');
const plansPage = document.getElementById('plans-page');
const optionsPage = document.getElementById('options-page');
const cartPage = document.getElementById('cart-page');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const totalPrice = document.getElementById('total-price');

// Текущий выбор
let currentService = null;
let currentPlan = null;

// Обновление счетчика корзины
function updateCartCount() {
    cartCount.textContent = cart.length;
}

// Навигация
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    page.classList.add('active');
}

// Выбор сервиса
function selectService(serviceId) {
    currentService = products[serviceId];
    document.getElementById('service-name').textContent = currentService.name;
    
    // Очистка контейнера планов
    const plansContainer = document.getElementById('plans-container');
    plansContainer.innerHTML = '';
    
    // Добавление планов
    currentService.plans.forEach(plan => {
        const planCard = document.createElement('div');
        planCard.className = 'plan-card';
        planCard.innerHTML = `
            <h2>${plan.name}</h2>
            <p>${plan.description}</p>
            <button class="add-to-cart" onclick="selectPlan('${plan.id}')">Обрати</button>
        `;
        plansContainer.appendChild(planCard);
    });
    
    showPage(plansPage);
}

// Выбор тарифа
function selectPlan(planId) {
    currentPlan = currentService.plans.find(plan => plan.id === planId);
    document.getElementById('plan-name').textContent = `${currentService.name} ${currentPlan.name}`;
    document.getElementById('plan-description').textContent = currentPlan.description;
    
    // Очистка контейнера опций
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    // Добавление опций
    currentPlan.options.forEach(option => {
        const optionCard = document.createElement('div');
        optionCard.className = 'option-card';
        optionCard.innerHTML = `
            <div class="period">${option.period}</div>
            <div class="price">${option.price} UAH</div>
            <button class="add-to-cart" onclick="addItemToCart('${option.period}', ${option.price})">Додати в корзину</button>
        `;
        optionsContainer.appendChild(optionCard);
    });
    
    showPage(optionsPage);
}

// Добавление в корзину
function addItemToCart(period, price) {
    const item = {
        service: currentService.name,
        plan: currentPlan.name,
        period,
        price
    };
    
    addToCart(item);
    updateCartCount();
    alert('Товар додано до корзини!');
}

// Показать корзину
function showCart() {
    updateCartView();
    showPage(cartPage);
}

// Показать меню заказа
function showOrderMenu(index) {
    const item = cart[index];
    document.getElementById('order-item-title').textContent = `${item.service} ${item.plan}`;
    document.getElementById('order-service').textContent = item.service;
    document.getElementById('order-plan').textContent = item.plan;
    document.getElementById('order-period').textContent = item.period;
    document.getElementById('order-price').textContent = item.price;
    
    // Сохраняем индекс товара
    document.getElementById('order-menu').dataset.index = index;
    
    // Показываем меню
    document.getElementById('order-menu').classList.add('active');
}

// Закрыть меню заказа
function closeOrderMenu() {
    document.getElementById('order-menu').classList.remove('active');
}

// Удалить товар из корзины
function removeFromCart() {
    const index = document.getElementById('order-menu').dataset.index;
    if (index !== undefined) {
        cart.splice(index, 1);
        updateCart();
        updateCartView();
        closeOrderMenu();
    }
}

// Обновление вида корзины
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
        cartItem.onclick = () => showOrderMenu(index);
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
        cartItems.appendChild(cartItem);
    });
    
    totalPrice.textContent = total;
}

// Навигация назад
function goBack() {
    showPage(servicesPage);
}

function goBackToPlans() {
    showPage(plansPage);
}

// Заказать только этот товар
function orderSingleItem() {
    const index = document.getElementById('order-menu').dataset.index;
    if (index !== undefined) {
        const item = cart[index];
        createOrder([item]);
    }
}

// Создание заказа
function createOrder(items) {
    // Формируем сообщение для Telegram-бота
    let message = "🛒 Моє замовлення:\n\n";
    
    items.forEach(item => {
        message += `▫️ ${item.service} ${item.plan} (${item.period}) - ${item.price} UAH\n`;
    });
    
    const total = items.reduce((sum, item) => sum + item.price, 0);
    message += `\n💳 Всього: ${total} UAH`;
    
    // Кодируем сообщение для URL
    const encodedMessage = encodeURIComponent(message);
    
    // Ссылка на Telegram бота с сообщением
    const botUsername = "SecureShopBot"; // Замените на реальный username бота
    const telegramUrl = `https://t.me/${botUsername}?start=${encodedMessage}`;
    
    // Открываем ссылку
    window.open(telegramUrl, '_blank');
}

// Оформление заказа (все товары)
function checkout() {
    if (cart.length === 0) {
        alert('Корзина порожня!');
        return;
    }
    
    createOrder(cart);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Добавляем функции в глобальную область видимости
    window.selectService = selectService;
    window.selectPlan = selectPlan;
    window.addItemToCart = addItemToCart;
    window.showCart = showCart;
    window.goBack = goBack;
    window.goBackToPlans = goBackToPlans;
    window.checkout = checkout;
    window.showOrderMenu = showOrderMenu;
    window.closeOrderMenu = closeOrderMenu;
    window.removeFromCart = removeFromCart;
    window.orderSingleItem = orderSingleItem;
});
