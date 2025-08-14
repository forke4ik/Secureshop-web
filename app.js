// app.js - Исправленная и упрощенная версия

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
// --- ИСПРАВЛЕНИЕ 1: Уникальные ID для контейнеров опций ---
const subscriptionOptionsContainer = document.getElementById('subscription-options-container'); // Для обычных подписок
const discordOptionsContainer = document.getElementById('discord-options-container');       // Для Discord Decor
// --- КОНЕЦ ИСПРАВЛЕНИЯ 1 ---

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
    // --- ИСПРАВЛЕНИЕ 2: Очистка правильных контейнеров ---
    if (subscriptionOptionsContainer) subscriptionOptionsContainer.innerHTML = '';
    if (discordOptionsContainer) discordOptionsContainer.innerHTML = '';
    if (plansContainer) plansContainer.innerHTML = '';
    // --- КОНЕЦ ИСПРАВЛЕНИЯ 2 ---
}

function resetDiscordDecorUI() {
    // Сброс UI для Discord Decor (вкладки, опции)
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    if (document.getElementById('tab-without-nitro')) {
        document.getElementById('tab-without-nitro').classList.add('active');
    }
    // --- ИСПРАВЛЕНИЕ 3: Очистка правильного контейнера ---
    if (discordOptionsContainer) discordOptionsContainer.innerHTML = '';
    // --- КОНЕЦ ИСПРАВЛЕНИЯ 3 ---
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

    // Обычные подписки
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
            descEl.textContent = plan.description;
            
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

    // Для обычных подписок
    const plan = currentService.plans.find(p => p.id === planId);
    if (!plan) {
        console.error("План не найден:", planId);
        return;
    }

    currentPlan = plan;
    console.log("Текущий план установлен:", currentPlan.name);

    if (planNameEl) planNameEl.textContent = `${currentService.name} ${currentPlan.name}`;
    if (planDescriptionEl) planDescriptionEl.textContent = currentPlan.description || '';
    // --- ИСПРАВЛЕНИЕ 4: Используем правильный контейнер ---
    if (subscriptionOptionsContainer) subscriptionOptionsContainer.innerHTML = '';
    // --- КОНЕЦ ИСПРАВЛЕНИЯ 4 ---

    // Создаем карточки опций (периодов)
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
            
            // --- ИСПРАВЛЕНИЕ 5: Добавляем в правильный контейнер ---
            if (subscriptionOptionsContainer) subscriptionOptionsContainer.appendChild(optionCard);
            // --- КОНЕЦ ИСПРАВЛЕНИЯ 5 ---
        });
    } else {
        // --- ИСПРАВЛЕНИЕ 6: Добавляем сообщение в правильный контейнер ---
        if (subscriptionOptionsContainer) subscriptionOptionsContainer.innerHTML = '<p>Опції відсутні</p>';
        // --- КОНЕЦ ИСПРАВЛЕНИЯ 6 ---
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

    // Устанавливаем заголовок и описание (они общие для options-page)
    // Но для Discord Decor мы используем другую страницу/контейнер
    // В данном случае заголовки будут браться со страницы options-page, если она активна,
    // или мы можем установить их напрямую, если discord-decor-type-page активна.
    // Для простоты оставим как есть, предполагая, что plan-name и plan-description
    // находятся на options-page, которая будет показана.
    // Более точный способ - обновлять их на discord-decor-type-page, если она активна.
    // Но для начала попробуем текущий подход.
    
    // Предполагаем, что planNameEl и planDescriptionEl находятся на options-page
    // Но опции рендерятся в discordOptionsContainer на discord-decor-type-page
    // Это может быть путаница. Лучше бы разделить.
    // Для начала просто убедимся, что рендер идет в правильное место.
    
    // Проверим, на какой странице мы находимся
    const isOnDiscordDecorPage = discordDecorTypePage.classList.contains('active');
    console.log("На странице Discord Decor?", isOnDiscordDecorPage);
    
    // Если мы на странице выбора типа decor, обновляем заголовки там
    // (предполагая, что они есть - их нет в HTML, нужно добавить)
    // Пока оставим, фокус на контейнере опций.
    
    if (planNameEl) planNameEl.textContent = `${currentService.name} ${currentPlan.name}`;
    if (planDescriptionEl) planDescriptionEl.textContent = currentPlan.description || '';
    
    // --- ИСПРАВЛЕНИЕ 7: Используем правильный контейнер для Discord Decor ---
    if (discordOptionsContainer) discordOptionsContainer.innerHTML = '';
    // --- КОНЕЦ ИСПРАВЛЕНИЯ 7 ---

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
            
            // --- ИСПРАВЛЕНИЕ 8: Добавляем в правильный контейнер для Discord Decor ---
            if (discordOptionsContainer) discordOptionsContainer.appendChild(optionCard);
            // --- КОНЕЦ ИСПРАВЛЕНИЯ 8 ---
        });
        
        // Для Discord Decor показываем страницу типа decor, если мы на ней не находимся
        if (!isOnDiscordDecorPage) {
             showPage(discordDecorTypePage);
        }
    } else {
        // --- ИСПРАВЛЕНИЕ 9: Добавляем сообщение в правильный контейнер для Discord Decor ---
        if (discordOptionsContainer) discordOptionsContainer.innerHTML = '<p>Опції відсутні</p>';
        // --- КОНЕЦ ИСПРАВЛЕНИЯ 9 ---
        if (!isOnDiscordDecorPage) {
             showPage(discordDecorTypePage);
        }
    }

    // Если мы вызвали эту функцию из selectPlan (например, для Discord Decor),
    // и страница options-page активна, то нужно переключиться на discord-decor-type-page
    // Но если мы вызвали из вкладки, то страница уже должна быть активна.
    // Упростим: если мы на options-page, переключаемся.
    // if (optionsPage.classList.contains('active')) {
    //     showPage(discordDecorTypePage);
    // }
    // Лучше явно показывать страницу, если это необходимо.
    // showPage(discordDecorTypePage); // Показываем страницу с опциями Discord Decor
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
        // Можно добавить обработчик клика для деталей заказа, если нужно
        
        cartItems.appendChild(cartItem);
    });
    
    if (totalPrice) totalPrice.textContent = total;
}
