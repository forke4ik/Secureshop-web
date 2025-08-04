// Получаем элементы страницы
const servicesPage = document.getElementById('services-page');
const plansPage = document.getElementById('plans-page');
const optionsPage = document.getElementById('options-page');
const cartPage = document.getElementById('cart-page');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const totalPrice = document.getElementById('total-price');

let currentService = null;
let currentPlan = null;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    setupEventListeners();
});

function setupEventListeners() {
    // Обработчики для сервисов
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const serviceId = e.currentTarget.dataset.service;
            selectService(serviceId);
        });
    });
    
    // Обработчик для корзины
    document.querySelector('.cart-icon').addEventListener('click', showCart);
    
    // Обработчики для кнопок "Назад"
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', goBack);
    });
}

function updateCartCount() {
    cartCount.textContent = cart.length;
}

function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    page.classList.add('active');
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
            <button class="add-to-cart plan-select">Обрати</button>
        `;
        plansContainer.appendChild(planCard);
        
        // Добавляем обработчик для новой кнопки
        planCard.querySelector('.plan-select').addEventListener('click', () => {
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
            <button class="add-to-cart option-select">Додати в корзину</button>
        `;
        optionsContainer.appendChild(optionCard);
        
        // Добавляем обработчик для новой кнопки
        optionCard.querySelector('.option-select').addEventListener('click', () => {
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
    updateCartCount();
    alert('Товар додано до корзини!');
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
    showPage(servicesPage);
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
