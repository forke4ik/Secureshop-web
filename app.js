// app.js - Полная версия с исправлениями и поддержкой цифровых товаров
// --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ---
let currentService = null;
let currentPlan = null;
let cart = []; // Убираем localStorage для упрощения и совместимости
// --- ЭЛЕМЕНТЫ DOM ---
const mainPage = document.getElementById('main-page');
const subscriptionsPage = document.getElementById('subscriptions-page');
const digitalPage = document.getElementById('digital-page');
const discordDecorTypePage = document.getElementById('discord-decor-type-page');
const plansPage = document.getElementById('plans-page');
const optionsPage = document.getElementById('options-page');
const cartPage = document.getElementById('cart-page');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const totalPrice = document.getElementById('total-price');
const cartIcon = document.getElementById('cart-icon');
const mainLogo = document.getElementById('main-logo');
const serviceNameEl = document.getElementById('service-name');
const planNameEl = document.getElementById('plan-name');
const planDescriptionEl = document.getElementById('plan-description');
const plansContainer = document.getElementById('plans-container');
// --- ИСПРАВЛЕНИЕ: Уникальные ID для контейнеров опций ---
const subscriptionOptionsContainer = document.getElementById('subscription-options-container'); // Для обычных подписок
const discordOptionsContainer = document.getElementById('discord-options-container');       // Для Discord Decor
// --- КОНЕЦ ИСПРАВЛЕНИЯ ---
// --- ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM загружен");
    setupEventListeners();
    showPage(mainPage); // Показываем главную страницу по умолчанию
    updateCartCount(); // Инициализируем счетчик корзины
});
// --- НАВИГАЦИЯ ---
function showPage(pageToShow) {
    // Скрываем все страницы
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    // Показываем нужную
    if (pageToShow) {
        pageToShow.classList.add('active');
        console.log("Страница показана:", pageToShow.id);
    }
}
function goToHome() {
    console.log("Переход на главную");
    showPage(mainPage);
    resetSelection();
}
function goBackToMainCategory() {
    console.log("Назад к категориям");
    showPage(mainPage);
}
function goBackToServices() {
    console.log("Назад к сервисам");
    if (currentService === discordDecorProducts) {
        showPage(digitalPage);
        resetDiscordDecorUI();
    } else {
        showPage(subscriptionsPage);
    }
}
function goBackToPlans() {
    console.log("Назад к планам");
    showPage(plansPage);
}
function resetSelection() {
    currentService = null;
    currentPlan = null;
    resetDiscordDecorUI();
    // --- ИСПРАВЛЕНИЕ: Очистка правильных контейнеров ---
    if (subscriptionOptionsContainer) subscriptionOptionsContainer.innerHTML = '';
    if (discordOptionsContainer) discordOptionsContainer.innerHTML = '';
    if (plansContainer) plansContainer.innerHTML = '';
    // --- КОНЕЦ ИСПРАВЛЕНИЯ ---
}
function resetDiscordDecorUI() {
    // Сброс UI для Discord Decor (вкладки, опции)
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    if (document.getElementById('tab-without-nitro')) {
        document.getElementById('tab-without-nitro').classList.add('active');
    }
    // --- ИСПРАВЛЕНИЕ: Очистка правильного контейнера ---
    if (discordOptionsContainer) discordOptionsContainer.innerHTML = '';
    // --- КОНЕЦ ИСПРАВЛЕНИЯ ---
}
// --- ОБРАБОТЧИКИ СОБЫТИЙ ---
function setupEventListeners() {
    console.log("Установка обработчиков событий");
    // --- Навигация по категориям ---
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            console.log("Выбрана категория:", category);
            if (category === 'subscriptions') {
                showPage(subscriptionsPage);
            } else if (category === 'digital') {
                showPage(digitalPage);
            }
        });
    });
    // --- Навигация по сервисам ---
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function() {
            const serviceId = this.dataset.service;
            console.log("Выбран сервис:", serviceId);
            selectService(serviceId);
        });
    });
    // --- Кнопки "Назад" ---
    const backButtons = {
        'back-to-main-category': goBackToMainCategory,
        'back-to-main-category-digital': goBackToMainCategory,
        'back-to-services': goBackToServices,
        'back-to-plans': goBackToPlans,
        'back-to-main-from-cart': goToHome,
        'back-to-digital': function() {
            showPage(digitalPage);
            resetDiscordDecorUI();
            currentService = null;
            currentPlan = null;
        }
    };
    for (const [id, handler] of Object.entries(backButtons)) {
        const element = document.getElementById(id);
        if (element) element.addEventListener('click', handler);
    }
    // --- Логотип для перехода на главную ---
    if (mainLogo) mainLogo.addEventListener('click', goToHome);
    // --- Корзина ---
    if (cartIcon) cartIcon.addEventListener('click', function() {
        console.log("Открытие корзины");
        updateCartView();
        showPage(cartPage);
    });
    // --- Вкладки Discord Decor ---
    const tabWithoutNitro = document.getElementById('tab-without-nitro');
    const tabWithNitro = document.getElementById('tab-with-nitro');
    if (tabWithoutNitro) {
        tabWithoutNitro.addEventListener('click', function() {
            console.log("Выбрана вкладка: Без Nitro");
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentService = discordDecorProducts;
            showDiscordDecorOptions('discord_decor_without_nitro');
        });
    }
    if (tabWithNitro) {
        tabWithNitro.addEventListener('click', function() {
            console.log("Выбрана вкладка: С Nitro");
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentService = discordDecorProducts;
            showDiscordDecorOptions('discord_decor_with_nitro');
        });
    }
    // --- Кнопка оформления заказа в корзине ---
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
}
// --- ЛОГИКА ВЫБОРА СЕРВИСА ---
function selectService(serviceId) {
    console.log("Функция selectService вызвана с:", serviceId);
    if (serviceId === 'discord_decor') {
        console.log("Выбран Discord Decor");
        currentService = discordDecorProducts;
        // Очищаем контейнер опций Discord перед показом
        if (discordOptionsContainer) discordOptionsContainer.innerHTML = '';
        showPage(discordDecorTypePage);
        // По умолчанию показываем опции "Без Nitro"
        // showDiscordDecorOptions будет вызвана по клику на вкладке
        return;
    }
    // Обычные подписки и цифровые товары
    currentService = products[serviceId];
    console.log("Текущий сервис установлен:", currentService?.name);
    if (!currentService) {
        console.error("Сервис не найден:", serviceId);
        return;
    }
    if (serviceNameEl) serviceNameEl.textContent = currentService.name;
    if (plansContainer) plansContainer.innerHTML = '';
    // Создаем карточки планов
    if (currentService.plans && currentService.plans.length > 0) {
        currentService.plans.forEach(plan => {
            const planCard = document.createElement('div');
            planCard.className = 'plan-card';
            const nameEl = document.createElement('h2');
            nameEl.textContent = plan.name;
            const descEl = document.createElement('p');
            descEl.innerHTML = plan.description; // Используем innerHTML для HTML в описании
            const selectBtn = document.createElement('button');
            selectBtn.className = 'add-to-cart select-plan-btn';
            selectBtn.textContent = 'Обрати';
            selectBtn.dataset.planId = plan.id;
            // --- ПРЯМОЙ ОБРАБОТЧИК КЛИКА НА КНОПКУ ---
            selectBtn.addEventListener('click', function() {
                console.log("Кнопка 'Обрати' нажата для плана:", plan.id);
                selectPlan(plan.id);
            });
            planCard.appendChild(nameEl);
            planCard.appendChild(descEl);
            planCard.appendChild(selectBtn);
            if (plansContainer) plansContainer.appendChild(planCard);
        });
    } else {
        if (plansContainer) plansContainer.innerHTML = '<p>Плани відсутні</p>';
    }
    showPage(plansPage);
}
// --- ЛОГИКА ВЫБОРА ПЛАНА ---
function selectPlan(planId) {
    console.log("Функция selectPlan вызвана с:", planId);
    if (!currentService) {
        console.error("Текущий сервис не установлен");
        return;
    }
    // Для Discord Decor логика другая (хотя этот путь маловероятен для обычных подписок)
    if (currentService === discordDecorProducts) {
        console.log("selectPlan: Это Discord Decor, вызываем showDiscordDecorOptions");
        showDiscordDecorOptions(planId);
        return;
    }
    // Для обычных подписок и цифровых товаров
    const plan = currentService.plans.find(p => p.id === planId);
    if (!plan) {
        console.error("План не найден:", planId);
        return;
    }
    currentPlan = plan;
    console.log("Текущий план установлен:", currentPlan.name);
    if (planNameEl) planNameEl.textContent = `${currentService.name} ${currentPlan.name}`;
    if (planDescriptionEl) planDescriptionEl.innerHTML = currentPlan.description || ''; // Используем innerHTML
    // --- ИСПРАВЛЕНИЕ: Используем правильный контейнер ---
    if (subscriptionOptionsContainer) subscriptionOptionsContainer.innerHTML = '';
    // --- КОНЕЦ ИСПРАВЛЕНИЯ ---
    // Создаем карточки опций (периодов/номиналов)
    if (plan.options && plan.options.length > 0) {
        plan.options.forEach(option => {
            const optionCard = document.createElement('div');
            optionCard.className = 'option-card';
            const periodEl = document.createElement('div');
            periodEl.className = 'period';
            periodEl.textContent = option.period;
            const priceEl = document.createElement('div');
            priceEl.className = 'price';
            priceEl.textContent = `${option.price} UAH`;
            const addToCartBtn = document.createElement('button');
            addToCartBtn.className = 'add-to-cart';
            addToCartBtn.textContent = 'Додати в корзину';
            // --- ПРЯМОЙ ОБРАБОТЧИК КЛИКА НА КНОПКУ ---
            addToCartBtn.addEventListener('click', function() {
                console.log("Кнопка 'Додати в корзину' нажата для опции:", option.period);
                addItemToCart(option.period, option.price);
            });
            optionCard.appendChild(periodEl);
            optionCard.appendChild(priceEl);
            optionCard.appendChild(addToCartBtn);
            // --- ИСПРАВЛЕНИЕ: Добавляем в правильный контейнер ---
            if (subscriptionOptionsContainer) subscriptionOptionsContainer.appendChild(optionCard);
            // --- КОНЕЦ ИСПРАВЛЕНИЯ ---
        });
    } else {
        // --- ИСПРАВЛЕНИЕ: Добавляем сообщение в правильный контейнер ---
        if (subscriptionOptionsContainer) subscriptionOptionsContainer.innerHTML = '<p>Опції відсутні</p>';
        // --- КОНЕЦ ИСПРАВЛЕНИЯ ---
    }
    showPage(optionsPage);
}
// --- ЛОГИКА DISCORD DECOR ---
function showDiscordDecorOptions(planId) {
    console.log("showDiscordDecorOptions вызвана с:", planId);
    if (!currentService || currentService !== discordDecorProducts) {
        console.error("Неверный сервис для Discord Decor");
        return;
    }
    const plan = currentService.plans.find(p => p.id === planId);
    if (!plan) {
        console.error("План Discord Decor не найден:", planId);
        return;
    }
    currentPlan = plan;
    console.log("Текущий план Discord Decor установлен:", currentPlan.name);
    // Устанавливаем заголовок и описание
    if (planNameEl) planNameEl.textContent = `${currentService.name} ${currentPlan.name}`;
    if (planDescriptionEl) planDescriptionEl.innerHTML = currentPlan.description || ''; // Используем innerHTML
    // --- ИСПРАВЛЕНИЕ: Используем правильный контейнер для Discord Decor ---
    if (discordOptionsContainer) discordOptionsContainer.innerHTML = '';
    // --- КОНЕЦ ИСПРАВЛЕНИЯ ---
    // Создаем карточки опций (номиналов)
    if (plan.options && plan.options.length > 0) {
        plan.options.forEach(option => {
            const optionCard = document.createElement('div');
            optionCard.className = 'option-card';
            const periodEl = document.createElement('div');
            periodEl.className = 'period';
            periodEl.textContent = option.period;
            const priceEl = document.createElement('div');
            priceEl.className = 'price';
            priceEl.textContent = `${option.price} UAH`;
            const addToCartBtn = document.createElement('button');
            addToCartBtn.className = 'add-to-cart';
            addToCartBtn.textContent = 'Додати в корзину';
            // --- ПРЯМОЙ ОБРАБОТЧИК КЛИКА НА КНОПКУ ---
            addToCartBtn.addEventListener('click', function() {
                console.log("Кнопка 'Додати в корзину' (Discord Decor) нажата для опции:", option.period);
                addItemToCart(option.period, option.price);
            });
            optionCard.appendChild(periodEl);
            optionCard.appendChild(priceEl);
            optionCard.appendChild(addToCartBtn);
            // --- ИСПРАВЛЕНИЕ: Добавляем в правильный контейнер для Discord Decor ---
            if (discordOptionsContainer) discordOptionsContainer.appendChild(optionCard);
            // --- КОНЕЦ ИСПРАВЛЕНИЯ ---
        });
        showPage(discordDecorTypePage);
    } else {
        // --- ИСПРАВЛЕНИЕ: Добавляем сообщение в правильный контейнер для Discord Decor ---
        if (discordOptionsContainer) discordOptionsContainer.innerHTML = '<p>Опції відсутні</p>';
        // --- КОНЕЦ ИСПРАВЛЕНИЯ ---
        showPage(discordDecorTypePage);
    }
}
// --- КОРЗИНА ---
function addItemToCart(period, price) {
    console.log("addItemToCart вызвана с:", period, price);
    if (!currentService || !currentPlan) {
        console.error("Не выбран сервис или план");
        alert('Спочатку оберіть сервіс і тариф!');
        return;
    }
    const item = {
        service: currentService.name,
        plan: currentPlan.name,
        period: period,
        price: price
    };
    cart.push(item);
    updateCartCount();
    alert('Товар додано до корзини!');
    console.log("Товар добавлен в корзину:", item);
}
function updateCartCount() {
    if (cartCount) cartCount.textContent = cart.length;
}
function updateCartView() {
    console.log("updateCartView вызвана");
    if (!cartItems) return;
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Ваша корзина порожня</p>';
        if (totalPrice) totalPrice.textContent = '0';
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
        // Добавляем обработчик клика для деталей заказа
        cartItem.addEventListener('click', () => showOrderMenu(index));
        cartItems.appendChild(cartItem);
    });
    if (totalPrice) totalPrice.textContent = total;
    // --- Добавляем обработчик для кнопки "Замовити через Telegram" ---
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn && !checkoutBtn.hasEventListener) {
        checkoutBtn.addEventListener('click', checkout);
        checkoutBtn.hasEventListener = true; // Флаг, чтобы не добавлять обработчик дважды
    }
}
// --- МЕНЮ ЗАКАЗА ---
function showOrderMenu(index) {
    if (index >= cart.length) return;
    const item = cart[index];
    const orderMenu = document.getElementById('order-menu');
    if (!orderMenu) return;
    document.getElementById('order-item-title').textContent = `${item.service} ${item.plan}`;
    document.getElementById('order-service').textContent = item.service;
    document.getElementById('order-plan').textContent = item.plan;
    document.getElementById('order-period').textContent = item.period;
    document.getElementById('order-price').textContent = item.price;
    orderMenu.dataset.index = index;
    orderMenu.classList.add('active');
    // Добавляем обработчики для кнопок в меню
    document.querySelector('.remove-btn')?.addEventListener('click', removeFromCart);
    document.querySelector('.order-btn')?.addEventListener('click', function() { orderSingleItem(index); });
    document.querySelector('.close-btn')?.addEventListener('click', closeOrderMenu);
}
function closeOrderMenu() {
    const orderMenu = document.getElementById('order-menu');
    if (orderMenu) orderMenu.classList.remove('active');
}
function removeFromCart() {
    const orderMenu = document.getElementById('order-menu');
    if (!orderMenu) return;
    const index = parseInt(orderMenu.dataset.index);
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        updateCartCount();
        updateCartView();
        closeOrderMenu();
    }
}
// --- ГЕНЕРАЦИЯ КОМАНДЫ ДЛЯ БОТА ---
function generateBotCommand(items) {
    const orderId = 'O' + Date.now().toString().slice(-6);
    let command = `/pay ${orderId} `;
    items.forEach(item => {
        let serviceAbbr;
        if (item.service.includes('ChatGPT')) serviceAbbr = "Cha";
        else if (item.service.includes('Discord Украшення')) serviceAbbr = "DisU";
        else if (item.service.includes('Discord')) serviceAbbr = "Dis";
        else if (item.service.includes('Duolingo')) serviceAbbr = "Duo";
        else if (item.service.includes('PicsArt')) serviceAbbr = "Pic";
        else if (item.service.includes('Canva')) serviceAbbr = "Can";
        else if (item.service.includes('Netflix')) serviceAbbr = "Net";
        else if (item.service.includes('Roblox')) serviceAbbr = "Rob";
        else if (item.service.includes('PSN') && item.service.includes('TRY')) serviceAbbr = "PSNT";
        else if (item.service.includes('PSN') && item.service.includes('INR')) serviceAbbr = "PSNI";
        else serviceAbbr = item.service.substring(0, 3);

        let planAbbr;
        if (item.plan.includes('Basic')) planAbbr = "Bas";
        else if (item.plan.includes('Full')) planAbbr = "Ful";
        else if (item.plan.includes('Individual')) planAbbr = "Ind";
        else if (item.plan.includes('Family')) planAbbr = "Fam";
        else if (item.plan.includes('Plus')) planAbbr = "Plu";
        else if (item.plan.includes('Pro')) planAbbr = "Pro";
        else if (item.plan.includes('Premium')) planAbbr = "Pre";
        else if (item.plan.includes('Без Nitro')) planAbbr = "BzN";
        else if (item.plan.includes('З Nitro')) planAbbr = "ZN";
        else if (item.plan.includes('Gift Card')) planAbbr = "GC";
        else planAbbr = item.plan.substring(0, 3);

        // Для цифровых товаров и Discord Decor используем номинал как период
        const periodAbbr = item.period.includes('$') || item.period.includes('TRU') || item.period.includes('INR') ? item.period : item.period.replace('місяць', 'м').replace('місяців', 'м');
        command += `${serviceAbbr}-${planAbbr}-${periodAbbr}-${item.price} `;
    });
    return {
        command: command.trim(),
        orderId: orderId
    };
}
// --- ОФОРМЛЕНИЕ ЗАКАЗА ---
function checkout() {
    if (cart.length === 0) {
        alert('Корзина порожня!');
        return;
    }
    const { command, orderId } = generateBotCommand(cart);
    const botUsername = "SecureShopBot"; // Исправлено имя бота
    const telegramUrl = `https://t.me/${botUsername}`;
    const message = `Ваше замовлення #${orderId} готове!
` +
                   `Скопіюйте цю команду та відправте її нашому боту:
` +
                   `<code>${command}</code>
` +
                   `Натисніть "Відкрити Telegram", щоб перейти до бота.`;
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'order-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Оформлення замовлення #${orderId}</h2>
            <div class="modal-message">${message}</div>
            <div class="modal-actions">
                <button class="copy-btn">Копіювати команду</button>
                <button class="telegram-btn">Відкрити Telegram</button>
                <button class="close-modal">Закрити</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    // Добавляем обработчики для кнопок модального окна
    modal.querySelector('.copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(command)
            .then(() => {
                alert('Команду скопійовано!');
                // Закрываем модальное окно после копирования
                document.body.removeChild(modal);
                // Очищаем корзину
                cart = [];
                updateCartCount();
                updateCartView();
                goToHome();
            })
            .catch(err => {
                console.error('Помилка копіювання:', err);
                alert('Не вдалося скопіювати команду. Спробуйте ще раз.');
            });
    });
    modal.querySelector('.telegram-btn').addEventListener('click', () => {
        window.open(telegramUrl, '_blank');
        // Закрываем модальное окно после открытия Telegram
        document.body.removeChild(modal);
        // Очищаем корзину
        cart = [];
        updateCartCount();
        updateCartView();
        goToHome();
    });
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}
// --- ОФОРМЛЕНИЕ ОДНОГО ТОВАРА ---
function orderSingleItem(index) {
    if (index >= cart.length) return;
    const item = cart[index];
    const { command, orderId } = generateBotCommand([item]);
    const botUsername = "SecureShopBot"; // Исправлено имя бота
    const telegramUrl = `https://t.me/${botUsername}`;
    const message = `Ваше замовлення #${orderId} готове!
` +
                   `Скопіюйте цю команду та відправте її нашому боту:
` +
                   `<code>${command}</code>
` +
                   `Натисніть "Відкрити Telegram", щоб перейти до бота.`;
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'order-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Оформлення замовлення #${orderId}</h2>
            <div class="modal-message">${message}</div>
            <div class="modal-actions">
                <button class="copy-btn">Копіювати команду</button>
                <button class="telegram-btn">Відкрити Telegram</button>
                <button class="close-modal">Закрити</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    // Добавляем обработчики для кнопок модального окна
    modal.querySelector('.copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(command)
            .then(() => {
                alert('Команду скопійовано!');
                // Закрываем модальное окно после копирования
                document.body.removeChild(modal);
                // Удаляем товар из корзины
                cart.splice(index, 1);
                updateCartCount();
                updateCartView();
                closeOrderMenu();
            })
            .catch(err => {
                console.error('Помилка копіювання:', err);
                alert('Не вдалося скопіювати команду. Спробуйте ще раз.');
            });
    });
    modal.querySelector('.telegram-btn').addEventListener('click', () => {
        window.open(telegramUrl, '_blank');
        // Закрываем модальное окно после открытия Telegram
        document.body.removeChild(modal);
        // Удаляем товар из корзины
        cart.splice(index, 1);
        updateCartCount();
        updateCartView();
        closeOrderMenu();
    });
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}
