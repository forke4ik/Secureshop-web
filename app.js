let currentService = null;
let currentPlan = null;
let cart = [];
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
const subscriptionOptionsContainer = document.getElementById('subscription-options-container');
const discordOptionsContainer = document.getElementById('discord-options-container');

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    showPage(mainPage);
    updateCartCount();
});

function showPage(pageToShow) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    if (pageToShow) {
        pageToShow.classList.add('active');
    }
}

function goToHome() {
    showPage(mainPage);
    resetSelection();
}

function goBackToMainCategory() {
    showPage(mainPage);
}

function goBackToServices() {
    if (currentService === discordDecorProducts) {
        showPage(digitalPage);
        resetDiscordDecorUI();
    } else {
        showPage(subscriptionsPage);
    }
}

function goBackToPlans() {
    showPage(plansPage);
}

function resetSelection() {
    currentService = null;
    currentPlan = null;
    resetDiscordDecorUI();
    if (subscriptionOptionsContainer) subscriptionOptionsContainer.innerHTML = '';
    if (discordOptionsContainer) discordOptionsContainer.innerHTML = '';
    if (plansContainer) plansContainer.innerHTML = '';
}

function resetDiscordDecorUI() {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    if (document.getElementById('tab-without-nitro')) {
        document.getElementById('tab-without-nitro').classList.add('active');
    }
    if (discordOptionsContainer) discordOptionsContainer.innerHTML = '';
}

function setupEventListeners() {
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            if (category === 'subscriptions') {
                showPage(subscriptionsPage);
            } else if (category === 'digital') {
                showPage(digitalPage);
            }
        });
    });

    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function() {
            const serviceId = this.dataset.service;
            selectService(serviceId);
        });
    });

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

    if (mainLogo) mainLogo.addEventListener('click', goToHome);

    if (cartIcon) cartIcon.addEventListener('click', function() {
        updateCartView();
        showPage(cartPage);
    });

    const tabWithoutNitro = document.getElementById('tab-without-nitro');
    const tabWithNitro = document.getElementById('tab-with-nitro');
    
    if (tabWithoutNitro) {
        tabWithoutNitro.addEventListener('click', function() {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentService = discordDecorProducts;
            showDiscordDecorOptions('discord_decor_without_nitro');
        });
    }
    
    if (tabWithNitro) {
        tabWithNitro.addEventListener('click', function() {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentService = discordDecorProducts;
            showDiscordDecorOptions('discord_decor_with_nitro');
        });
    }

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
}

function selectService(serviceId) {
    if (serviceId === 'discord_decor') {
        currentService = discordDecorProducts;
        if (discordOptionsContainer) discordOptionsContainer.innerHTML = '';
        showPage(discordDecorTypePage);
        return;
    }

    currentService = products[serviceId];
    if (!currentService) {
        return;
    }
    
    if (serviceNameEl) serviceNameEl.textContent = currentService.name;
    if (plansContainer) plansContainer.innerHTML = '';

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
            
            selectBtn.addEventListener('click', function() {
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

function selectPlan(planId) {
    if (!currentService) {
        return;
    }

    if (currentService === discordDecorProducts) {
        showDiscordDecorOptions(planId);
        return;
    }

    const plan = currentService.plans.find(p => p.id === planId);
    if (!plan) {
        return;
    }
    
    currentPlan = plan;
    if (planNameEl) planNameEl.textContent = `${currentService.name} ${currentPlan.name}`;
    if (planDescriptionEl) planDescriptionEl.textContent = currentPlan.description || '';
    if (subscriptionOptionsContainer) subscriptionOptionsContainer.innerHTML = '';

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
            
            addToCartBtn.addEventListener('click', function() {
                addItemToCart(option.period, option.price);
            });
            
            optionCard.appendChild(periodEl);
            optionCard.appendChild(priceEl);
            optionCard.appendChild(addToCartBtn);
            if (subscriptionOptionsContainer) subscriptionOptionsContainer.appendChild(optionCard);
        });
    } else {
        if (subscriptionOptionsContainer) subscriptionOptionsContainer.innerHTML = '<p>Опції відсутні</p>';
    }
    showPage(optionsPage);
}

function showDiscordDecorOptions(planId) {
    if (!currentService || currentService !== discordDecorProducts) {
        return;
    }
    
    const plan = currentService.plans.find(p => p.id === planId);
    if (!plan) {
        return;
    }
    
    currentPlan = plan;
    if (planNameEl) planNameEl.textContent = `${currentService.name} ${currentPlan.name}`;
    if (planDescriptionEl) planDescriptionEl.textContent = currentPlan.description || '';
    if (discordOptionsContainer) discordOptionsContainer.innerHTML = '';

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
            
            addToCartBtn.addEventListener('click', function() {
                addItemToCart(option.period, option.price);
            });
            
            optionCard.appendChild(periodEl);
            optionCard.appendChild(priceEl);
            optionCard.appendChild(addToCartBtn);
            if (discordOptionsContainer) discordOptionsContainer.appendChild(optionCard);
        });
        showPage(discordDecorTypePage);
    } else {
        if (discordOptionsContainer) discordOptionsContainer.innerHTML = '<p>Опції відсутні</p>';
        showPage(discordDecorTypePage);
    }
}

function addItemToCart(period, price) {
    if (!currentService || !currentPlan) {
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
}

function updateCartCount() {
    if (cartCount) cartCount.textContent = cart.length;
}

function updateCartView() {
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
        
        cartItem.addEventListener('click', () => showOrderMenu(index));
        cartItems.appendChild(cartItem);
    });
    
    if (totalPrice) totalPrice.textContent = total;
    
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn && !checkoutBtn.hasEventListener) {
        checkoutBtn.addEventListener('click', checkout);
        checkoutBtn.hasEventListener = true;
    }
}

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
        
        const periodAbbr = item.period.includes('€') ? item.period : item.period.replace('місяць', 'м').replace('місяців', 'м');
        command += `${serviceAbbr}-${planAbbr}-${periodAbbr}-${item.price} `;
    });
    return {
        command: command.trim(),
        orderId: orderId
    };
}

function checkout() {
    if (cart.length === 0) {
        alert('Корзина порожня!');
        return;
    }
    
    const { command, orderId } = generateBotCommand(cart);
    const botUsername = "SecureShopBot";
    const telegramUrl = `https://t.me/${botUsername}`;
    const message = `Ваше замовлення #${orderId} готове!
Скопіюйте цю команду та відправте її нашому боту:
<code>${command}</code>
Натисніть "Відкрити Telegram", щоб перейти до бота.`;

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
            .then(() => {
                const messageEl = modal.querySelector('.modal-message');
                if (messageEl) {
                    messageEl.innerHTML = `<span style="color: var(--success); font-weight: bold;">Команду успішно скопійовано! Ви можете її відправити боту.</span>`;
                }
                const copyBtn = modal.querySelector('.copy-btn');
                if (copyBtn) {
                    copyBtn.textContent = 'Скопійовано!';
                    copyBtn.disabled = true;
                    copyBtn.style.opacity = '0.7';
                }
            })
            .catch(err => {
                const messageEl = modal.querySelector('.modal-message');
                if (messageEl) {
                    messageEl.innerHTML = `<span style="color: var(--danger); font-weight: bold;">Помилка копіювання: ${err.message || 'Спробуйте ще раз.'}</span>`;
                }
            });
    });

    modal.querySelector('.telegram-btn').addEventListener('click', () => {
        window.open(telegramUrl, '_blank');
        document.body.removeChild(modal);
        cart = [];
        updateCartCount();
        updateCartView();
        goToHome();
    });

    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

function orderSingleItem(index) {
    if (index >= cart.length) return;
    const item = cart[index];
    const { command, orderId } = generateBotCommand([item]);
    const botUsername = "SecureShopBot";
    const telegramUrl = `https://t.me/${botUsername}`;
    const message = `Ваше замовлення #${orderId} готове!
Скопіюйте цю команду та відправте її нашому боту:
<code>${command}</code>
Натисніть "Відкрити Telegram", щоб перейти до бота.`;

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
            .then(() => {
                const messageEl = modal.querySelector('.modal-message');
                if (messageEl) {
                    messageEl.innerHTML = `<span style="color: var(--success); font-weight: bold;">Команду успішно скопійовано! Ви можете її відправити боту.</span>`;
                }
                const copyBtn = modal.querySelector('.copy-btn');
                if (copyBtn) {
                    copyBtn.textContent = 'Скопійовано!';
                    copyBtn.disabled = true;
                    copyBtn.style.opacity = '0.7';
                }
            })
            .catch(err => {
                const messageEl = modal.querySelector('.modal-message');
                if (messageEl) {
                    messageEl.innerHTML = `<span style="color: var(--danger); font-weight: bold;">Помилка копіювання: ${err.message || 'Спробуйте ще раз.'}</span>`;
                }
            });
    });

    modal.querySelector('.telegram-btn').addEventListener('click', () => {
        window.open(telegramUrl, '_blank');
        document.body.removeChild(modal);
        cart.splice(index, 1);
        updateCartCount();
        updateCartView();
        closeOrderMenu();
    });

    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}
