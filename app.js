// app.js

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

// Элементы кнопок "Назад"
const backToMainCategoryBtn = document.getElementById('back-to-main-category');
const backToMainCategoryDigitalBtn = document.getElementById('back-to-main-category-digital');
const backToServicesBtn = document.getElementById('back-to-services');
const backToPlansBtn = document.getElementById('back-to-plans');
const backToMainFromCartBtn = document.getElementById('back-to-main-from-cart');
const backToDigitalBtn = document.getElementById('back-to-digital');

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

    // Добавляем обработчики для кнопок островка Discord украшений
    const tabWithoutNitro = document.getElementById('tab-without-nitro');
    const tabWithNitro = document.getElementById('tab-with-nitro');

    if (tabWithoutNitro) {
        tabWithoutNitro.addEventListener('click', () => {
            currentService = discordDecorProducts;
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            tabWithoutNitro.classList.add('active');
            showDiscordDecorOptions('discord_decor_without_nitro');
        });
    }

    if (tabWithNitro) {
        tabWithNitro.addEventListener('click', () => {
            currentService = discordDecorProducts;
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            tabWithNitro.classList.add('active');
            showDiscordDecorOptions('discord_decor_with_nitro');
        });
    }
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
    
    if (page !== mainPage) {
        pageHistory.push(page);
    }
}

function setupEventListeners() {
    // Обработчики для категорий (новые)
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            if (category === 'subscriptions') {
                showPage(subscriptionsPage);
            } else if (category === 'digital') {
                showPage(digitalPage);
            }
        });
    });
    
    // Обработчики для сервисов
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const serviceId = card.dataset.service;
            selectService(serviceId);
        });
    });
    
    if (cartIcon) cartIcon.addEventListener('click', showCart);
    
    if (backToMainCategoryBtn) backToMainCategoryBtn.addEventListener('click', () => showPage(mainPage));
    if (backToMainCategoryDigitalBtn) backToMainCategoryDigitalBtn.addEventListener('click', () => showPage(mainPage));
    if (backToServicesBtn) backToServicesBtn.addEventListener('click', goBackToServices);
    if (backToPlansBtn) backToPlansBtn.addEventListener('click', () => showPage(plansPage));
    if (backToMainFromCartBtn) backToMainFromCartBtn.addEventListener('click', goToHome);
    if (backToDigitalBtn) backToDigitalBtn.addEventListener('click', () => {
        showPage(digitalPage);
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        if (document.getElementById('tab-without-nitro')) {
            document.getElementById('tab-without-nitro').classList.add('active');
        }
        const optionsContainer = document.getElementById('options-container');
        if (optionsContainer) {
            optionsContainer.innerHTML = '';
        }
        currentService = null;
        currentPlan = null;
    });
    
    if (mainLogo) mainLogo.addEventListener('click', goToHome);
    
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
    pageHistory.length = 0;
    showPage(mainPage);
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    if (document.getElementById('tab-without-nitro')) {
        document.getElementById('tab-without-nitro').classList.add('active');
    }
    const optionsContainer = document.getElementById('options-container');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
    }
    currentService = null;
    currentPlan = null;
}

function goBackToServices() {
    if (currentService === discordDecorProducts) {
        showPage(digitalPage);
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        if (document.getElementById('tab-without-nitro')) {
            document.getElementById('tab-without-nitro').classList.add('active');
        }
        const optionsContainer = document.getElementById('options-container');
        if (optionsContainer) {
            optionsContainer.innerHTML = '';
        }
        currentService = null;
        currentPlan = null;
    } else {
        showPage(subscriptionsPage);
    }
}

function selectService(serviceId) {
    if (serviceId === 'discord_decor') {
        showPage(discordDecorTypePage);
        currentService = discordDecorProducts;
        showDiscordDecorOptions('discord_decor_without_nitro');
        return;
    }

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
                <button class="add-to-cart select-plan-btn" data-plan-id="${plan.id}">Обрати</button>
            `;
            plansContainer.appendChild(planCard);

            planCard.querySelector('.select-plan-btn').addEventListener('click', (e) => {
                const planId = e.target.dataset.planId;
                selectPlan(planId);
            });
        });
    }
    showPage(plansPage);
}

function showDiscordDecorOptions(planId) {
    if (!currentService || currentService !== discordDecorProducts) return;

    const plan = currentService.plans.find(p => p.id === planId);
    if (!plan) return;

    currentPlan = plan;

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

            optionCard.querySelector('button').addEventListener('click', () => {
                addItemToCart(option.period, option.price);
            });
        });
    }
}

// УПРОЩЕННАЯ И ОТЛАЖЕННАЯ ФУНКЦИЯ selectPlan
function selectPlan(planId) {
    console.log("=== selectPlan called ===");
    console.log("planId:", planId);
    console.log("currentService:", currentService);
    
    if (!currentService) {
        console.error("❌ ERROR: currentService is null or undefined");
        return;
    }

    // Специальная логика для Discord украшений
    if (currentService === discordDecorProducts) {
        console.log("📦 Handling discord decor products - this should not happen here");
        return;
    } else {
        // Логика для обычных подписок
        console.log("📋 Handling regular subscription products");
        
        // Найдем план
        const plan = currentService.plans.find(p => p.id === planId);
        console.log("🔍 Found plan:", plan);
        
        if (!plan) {
            console.error("❌ ERROR: Plan not found for id:", planId);
            return;
        }

        // Установим текущий план
        currentPlan = plan;
        console.log("✅ Current plan set:", currentPlan);

        // Обновим заголовки на странице
        const planNameElement = document.getElementById('plan-name');
        const planDescriptionElement = document.getElementById('plan-description');
        
        if (planNameElement) {
            planNameElement.textContent = `${currentService.name} ${currentPlan.name}`;
            console.log("✅ Plan name updated");
        } else {
            console.error("❌ ERROR: plan-name element not found");
        }
        
        if (planDescriptionElement) {
            planDescriptionElement.textContent = currentPlan.description;
            console.log("✅ Plan description updated");
        } else {
            console.error("❌ ERROR: plan-description element not found");
        }

        // Найдем контейнер для опций
        const optionsContainer = document.getElementById('options-container');
        console.log("📦 optionsContainer element:", optionsContainer);
        
        if (optionsContainer) {
            // Очистим контейнер
            optionsContainer.innerHTML = '';
            console.log("🧹 optionsContainer cleared");
            
            // Проверим наличие опций
            console.log("📋 Plan options:", plan.options);
            
            if (plan.options && plan.options.length > 0) {
                console.log(`📊 Found ${plan.options.length} options, creating cards...`);
                
                plan.options.forEach((option, index) => {
                    console.log(`   📦 Creating option card ${index}:`, option);
                    
                    const optionCard = document.createElement('div');
                    optionCard.className = 'option-card';
                    optionCard.innerHTML = `
                        <div class="period">${option.period}</div>
                        <div class="price">${option.price} UAH</div>
                        <button class="add-to-cart" data-option-index="${index}">Додати в корзину</button>
                    `;
                    optionsContainer.appendChild(optionCard);

                    // Добавим обработчик события
                    const button = optionCard.querySelector('button');
                    if (button) {
                        button.addEventListener('click', () => {
                            console.log("🖱️ Add to cart button clicked for option:", option);
                            addItemToCart(option.period, option.price);
                        });
                        console.log(`   ✅ Event listener added for option ${index}`);
                    } else {
                        console.error(`   ❌ ERROR: Button not found for option ${index}`);
                    }
                });
                console.log("✅ All option cards created");
            } else {
                // Если опций нет
                optionsContainer.innerHTML = '<p class="empty-cart">Опції для цього тарифу відсутні</p>';
                console.log("⚠️ No options found, showing message");
            }
        } else {
            console.error("❌ ERROR: optionsContainer element not found in DOM");
        }
        
        // Покажем страницу с опциями
        console.log("➡️ Showing options page");
        showPage(optionsPage);
        console.log("=== selectPlan finished ===");
    }
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
        showPage(mainPage);
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
        else planAbbr = item.plan.substring(0, 3);
        
        const periodAbbr = item.period.replace('місяць', 'м').replace('місяців', 'м');
        
        command += `${serviceAbbr}-${planAbbr}-${periodAbbr}-${item.price} `;
    });
    
    return {
        command: command.trim(),
        orderId: orderId
    };
}

async function checkout() {
    if (cart.length === 0) {
        alert('Корзина порожня!');
        return;
    }
    
    const { command, orderId } = generateBotCommand(cart);
    
    const botUsername = "secureshopBot";
    const telegramUrl = `https://t.me/${botUsername}`;
    
    const message = `Ваше замовлення #${orderId} готове!\n\n` +
                   `Скопіюйте цю команду та відправте її нашому боту:\n\n` +
                   `<code>${command}</code>\n\n` +
                   `Натисніть "Відкрити Telegram", щоб перейти до бота.`;
    
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
    
    modal.querySelector('.copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(command)
            .then(() => alert('Команду скопійовано!'))
            .catch(err => console.error('Помилка копіювання:', err));
    });
    
    modal.querySelector('.telegram-btn').addEventListener('click', () => {
        window.open(telegramUrl, '_blank');
    });
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartView();
    showPage(mainPage);
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    if (document.getElementById('tab-without-nitro')) {
        document.getElementById('tab-without-nitro').classList.add('active');
    }
    const optionsContainer = document.getElementById('options-container');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
    }
    currentService = null;
    currentPlan = null;
}

async function orderSingleItem() {
    const orderMenu = document.getElementById('order-menu');
    if (!orderMenu) return;
    
    const index = orderMenu.dataset.index;
    if (index >= 0 && index < cart.length) {
        const item = cart[index];
        
        const { command, orderId } = generateBotCommand([item]);
        
        const botUsername = "secureshopBot";
        const telegramUrl = `https://t.me/${botUsername}`;
        
        const message = `Ваше замовлення #${orderId} готове!\n\n` +
                       `Скопіюйте цю команду та відправте її нашому боту:\n\n` +
                       `<code>${command}</code>\n\n` +
                       `Натисніть "Відкрити Telegram", щоб перейти до бота.`;
        
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
        
        modal.querySelector('.copy-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(command)
                .then(() => alert('Команду скопійовано!'))
                .catch(err => console.error('Помилка копіювання:', err));
        });
        
        modal.querySelector('.telegram-btn').addEventListener('click', () => {
            window.open(telegramUrl, '_blank');
        });
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartView();
        closeOrderMenu();
    }
}
