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
    if (cartIcon) cartIcon.addEventListener('click', showCart);
    
    // Обработчики для кнопок "Назад"
    if (backToServicesBtn) backToServicesBtn.addEventListener('click', () => showPage(servicesPage));
    if (backToPlansBtn) backToPlansBtn.addEventListener('click', () => showPage(plansPage));
    
    // Кнопка "Назад" в корзине ведет на главную
    if (backToMainBtn) backToMainBtn.addEventListener('click', goToHome);
    
    // Обработчик для логотипа
    if (mainLogo) mainLogo.addEventListener('click', goToHome);
    
    // Обработчик для закрытия меню по клику вне контента
    const orderMenu = document.getElementById('order-menu');
    if (orderMenu) {
        orderMenu.addEventListener('click', (e) => {
            if (e.target === orderMenu) {
                closeOrderMenu();
            }
        });
    }
}

function goToHome() {
    // Очищаем историю и показываем главную страницу
    pageHistory.length = 0;
    showPage(servicesPage);
}

function selectService(serviceId) {
    currentService = products[serviceId];
    document.getElementById('service-name').textContent = currentService.name;
    
    const plansContainer = document.getElementById('plans-container');
    if (plansContainer) {
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
    }
    
    showPage(plansPage);
}

function selectPlan(planId) {
    if (!currentService) return;
    
    const plan = currentService.plans.find(p => p.id === planId);
    if (!plan) return;
    
    currentPlan = plan;
    document.getElementById('plan-name').textContent = `${currentService.name} ${currentPlan.name}`;
    document.getElementById('plan-description').textContent = currentPlan.description;
    
    const optionsContainer = document.getElementById('options-container');
    if (optionsContainer) {
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
    }
    
    showPage(optionsPage);
}

function addItemToCart(period, price) {
    if (!currentService || !currentPlan) return;
    
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
    if (!cartItems) return;
    
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
    
    if (totalPrice) totalPrice.textContent = total;
    
    // Обработчик для кнопки оформления заказа
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
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
    if (index >= cart.length) return;
    
    const item = cart[index];
    document.getElementById('order-item-title').textContent = `${item.service} ${item.plan}`;
    document.getElementById('order-service').textContent = item.service;
    document.getElementById('order-plan').textContent = item.plan;
    document.getElementById('order-period').textContent = item.period;
    document.getElementById('order-price').textContent = item.price;
    
    const orderMenu = document.getElementById('order-menu');
    if (orderMenu) {
        orderMenu.dataset.index = index;
        orderMenu.classList.add('active');
        
        // Обработчики для кнопок в меню
        document.querySelector('.remove-btn')?.addEventListener('click', removeFromCart);
        document.querySelector('.order-btn')?.addEventListener('click', orderSingleItem);
        document.querySelector('.close-btn')?.addEventListener('click', closeOrderMenu);
    }
}

function closeOrderMenu() {
    const orderMenu = document.getElementById('order-menu');
    if (orderMenu) orderMenu.classList.remove('active');
}

function removeFromCart() {
    const orderMenu = document.getElementById('order-menu');
    if (!orderMenu) return;
    
    const index = orderMenu.dataset.index;
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartView();
        closeOrderMenu();
    }
}

// Функция оформления заказа через Telegram deep link
async function checkout() {
    console.group("🚀 Процесс оформления заказа");
    
    if (cart.length === 0) {
        console.error("❌ Ошибка: корзина пуста");
        alert('Корзина порожня!');
        console.groupEnd();
        return;
    }
    
    console.log("🛒 Содержимое корзины:", cart);
    
    // Рассчитываем общую сумму
    let total = 0;
    cart.forEach(item => total += item.price);
    
    try {
        // Отправляем заказ на сервер
        const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: cart,
                total: total
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log("✅ Заказ сохранен, ID:", result.order_id);
            
            // Формируем ссылку для Telegram
            const botUsername = "secureshopBot"; // Замените на реальное имя бота
            const telegramUrl = `https://t.me/${botUsername}?start=order_id=${result.order_id}`;
            
            console.log("🔗 Ссылка для Telegram:", telegramUrl);
            
            // Показываем подтверждение
            const confirmSend = confirm("Ваше замовлення збережено! Натисніть OK, щоб відкрити Telegram та завершити оплату.");
            
            if (confirmSend) {
                console.log("✅ Пользователь подтвердил отправку");
                window.open(telegramUrl, '_blank');
                
                // Очищаем корзину
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                updateCartView();
                showPage(servicesPage);
            } else {
                console.log("❌ Пользователь отменил отправку");
            }
        } else {
            console.error("❌ Ошибка сохранения заказа:", result.error);
            alert("Помилка збереження замовлення. Спробуйте ще раз.");
        }
    } catch (error) {
        console.error("🔥 Ошибка при отправке заказа:", error);
        alert("Сталася помилка. Спробуйте пізніше.");
    }
    
    console.groupEnd();
}

// Обновленная функция для оформления одного товара
async function orderSingleItem() {
    const orderMenu = document.getElementById('order-menu');
    if (!orderMenu) return;
    
    const index = orderMenu.dataset.index;
    if (index >= 0 && index < cart.length) {
        const item = cart[index];
        
        try {
            // Отправляем единичный заказ на сервер
            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: [item],
                    total: item.price
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                const botUsername = "secureshopBot";
                const telegramUrl = `https://t.me/${botUsername}?start=order_id=${result.order_id}`;
                
                const confirmSend = confirm("Ваше замовлення збережено! Натисніть OK, щоб відкрити Telegram та завершити оплату.");
                
                if (confirmSend) {
                    window.open(telegramUrl, '_blank');
                }
                
                // Удаляем товар из корзины
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                updateCartView();
                closeOrderMenu();
            } else {
                alert("Помилка: " + result.error);
            }
        } catch (error) {
            console.error("Ошибка при оформлении единичного товара:", error);
            alert("Сталася помилка. Спробуйте пізніше.");
        }
    }
}
