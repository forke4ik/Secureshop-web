// ═══════════════ Configuration ═══════════════
const BOT_API_URL = 'https://secureshop-hzqd.onrender.com';

// ═══════════════ Telegram WebApp ═══════════════
const tg = window.Telegram && window.Telegram.WebApp;
let tgUser = null;

if (tg) {
    tg.ready();
    tg.expand();
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        tgUser = tg.initDataUnsafe.user;
    }
    // Apply Telegram theme colors if available
    if (tg.themeParams) {
        document.documentElement.style.setProperty('--tg-bg', tg.themeParams.bg_color || '#f0edff');
    }
}

function getTgUserId() {
    return tgUser ? tgUser.id : null;
}

function getTgUsername() {
    return tgUser ? (tgUser.username || '') : '';
}

function getTgFirstName() {
    return tgUser ? (tgUser.first_name || '') : '';
}

// ═══════════════ State ═══════════════
let currentService = null;
let currentPlan = null;
let cart = [];
let currentNavPage = 'shop';

// ═══════════════ DOM Elements ═══════════════
const mainPage = document.getElementById('main-page');
const subscriptionsPage = document.getElementById('subscriptions-page');
const digitalPage = document.getElementById('digital-page');
const discordDecorTypePage = document.getElementById('discord-decor-type-page');
const plansPage = document.getElementById('plans-page');
const optionsPage = document.getElementById('options-page');
const cartPage = document.getElementById('cart-page');
const profilePage = document.getElementById('profile-page');
const ordersPage = document.getElementById('orders-page');
const accountsPage = document.getElementById('accounts-page');
const supportPage = document.getElementById('support-page');
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
    renderServiceCards();
    setupEventListeners();
    setupBottomNav();
    showPage(mainPage);
    updateCartCount();
    setupHeaderScroll();
    setupKeyboardSupport();
});

// Re-render cards when API data loads
const _origLoadProducts = window.loadProductsFromAPI;
if (typeof loadProductsFromAPI === 'function') {
    const _origFn = loadProductsFromAPI;
    window.loadProductsFromAPI = async function() {
        await _origFn();
        renderServiceCards();
    };
    window.loadProductsFromAPI();
}

// ═══════════════ Toast Notification System ═══════════════
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = '✅';
    if (type === 'error') icon = '❌';
    else if (type === 'info') icon = 'ℹ️';

    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        toast.addEventListener('animationend', () => toast.remove());
    }, 2800);
}

// ═══════════════ Header scroll effect ═══════════════
function setupHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                header.classList.toggle('scrolled', window.scrollY > 10);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ═══════════════ Keyboard support ═══════════════
function setupKeyboardSupport() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const orderMenu = document.getElementById('order-menu');
            if (orderMenu && orderMenu.classList.contains('active')) {
                closeOrderMenu();
                return;
            }
            const modal = document.querySelector('.order-modal');
            if (modal) {
                modal.remove();
            }
        }
    });
}

// ═══════════════ Page Navigation ═══════════════
function showPage(pageToShow) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    if (pageToShow) {
        pageToShow.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function goToHome() {
    showPage(mainPage);
    resetSelection();
    setActiveNav('shop');
}

function goBackToMainCategory() {
    showPage(mainPage);
    setActiveNav('shop');
}

function goBackToServices() {
    if (currentService && 
        (currentService === discordDecorProducts || 
         currentService === discordBoostsProducts || 
         ['discord_decor', 'discord_boosts', 'psn'].includes(getServiceIdByObject(currentService)))) {
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

// ═══════════════ Bottom Navigation ═══════════════
function setupBottomNav() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.dataset.page;
            navigateToSection(page);
        });
    });
}

function setActiveNav(pageName) {
    currentNavPage = pageName;
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageName);
    });
}

function navigateToSection(section) {
    setActiveNav(section);
    resetSelection();

    switch (section) {
        case 'shop':
            showPage(mainPage);
            break;
        case 'profile':
            showPage(profilePage);
            loadProfile();
            break;
        case 'orders':
            showPage(ordersPage);
            loadOrders();
            break;
        case 'accounts':
            showPage(accountsPage);
            break;
        case 'support':
            showPage(supportPage);
            break;
    }
}

// ═══════════════ Dynamic service card rendering ═══════════════
function createServiceCard(serviceId, name, logoSrc) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.dataset.service = serviceId;

    const img = document.createElement('img');
    img.src = logoSrc;
    img.alt = name + ' Logo';
    img.onerror = function() {
        const placeholder = document.createElement('div');
        placeholder.className = 'service-logo-placeholder';
        placeholder.textContent = name.charAt(0);
        this.replaceWith(placeholder);
    };
    card.appendChild(img);

    const h3 = document.createElement('h3');
    h3.textContent = name;
    card.appendChild(h3);

    card.addEventListener('click', () => selectService(serviceId));
    return card;
}

function renderServiceCards() {
    const subsGrid = document.getElementById('subscriptions-grid');
    if (subsGrid) {
        subsGrid.innerHTML = '';
        for (const [key, service] of Object.entries(products)) {
            if (key === 'psn') continue;
            const card = createServiceCard(key, service.name, service.logo || guessLogo(key, service.name));
            subsGrid.appendChild(card);
        }
    }

    const digGrid = document.getElementById('digital-grid');
    if (digGrid) {
        digGrid.innerHTML = '';
        digGrid.appendChild(createServiceCard('discord_decor', discordDecorProducts.name, discordDecorProducts.logo || 'images/discord.webp'));
        digGrid.appendChild(createServiceCard('discord_boosts', discordBoostsProducts.name, discordBoostsProducts.logo || 'images/discord.webp'));
        if (products['psn']) {
            digGrid.appendChild(createServiceCard('psn', products['psn'].name, products['psn'].logo || 'images/psn.webp'));
        }
    }
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
        setActiveNav('shop');
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

function getServiceIdByObject(serviceObj) {
    if (serviceObj === discordDecorProducts) return 'discord_decor';
    if (serviceObj === discordBoostsProducts) return 'discord_boosts';
    for (const [id, service] of Object.entries(products)) {
        if (service === serviceObj) {
            return id;
        }
    }
    return null;
}

function selectService(serviceId) {
    if (serviceId === 'discord_decor') {
        currentService = discordDecorProducts;
        if (discordOptionsContainer) discordOptionsContainer.innerHTML = '';
        showPage(discordDecorTypePage);
        showDiscordDecorOptions('discord_decor_without_nitro');
        return;
    }

    if (serviceId === 'discord_boosts') {
        currentService = discordBoostsProducts;
    } else {
        currentService = products[serviceId];
    }

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
        showToast('Спочатку оберіть сервіс і тариф!', 'error');
        return;
    }

    const item = {
        service: currentService.name,
        plan: currentPlan.name,
        period: period,
        price: price,
        warranty: currentService.warranty || null
    };

    cart.push(item);
    updateCartCount();
    showToast('Товар додано до кошика! 🎉');
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

    const warrantyRow = document.getElementById('order-warranty-row');
    const warrantyEl = document.getElementById('order-warranty');
    if (item.warranty) {
        warrantyEl.textContent = item.warranty;
        warrantyRow.style.display = '';
    } else {
        warrantyRow.style.display = 'none';
    }

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

// ═══════════════ Order Submission (Direct API) ═══════════════

async function submitOrder(items) {
    const userId = getTgUserId();

    // If not inside Telegram — fallback to old copy-command flow
    if (!userId) {
        showFallbackOrderModal(items);
        return;
    }

    const totalUah = items.reduce((sum, item) => sum + item.price, 0);

    const body = {
        user_id: userId,
        username: getTgUsername(),
        first_name: getTgFirstName(),
        items: items.map(item => ({
            service: item.service,
            plan: item.plan,
            period: item.period,
            price: item.price,
        })),
        total_uah: totalUah,
    };

    // Show loading
    const modal = document.createElement('div');
    modal.className = 'order-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>⏳ Оформлення замовлення...</h2>
            <div class="modal-message">
                <p style="text-align:center;"><i class="fas fa-spinner fa-spin" style="font-size:32px;color:var(--primary);"></i></p>
                <p style="text-align:center;margin-top:12px;">Зачекайте, ваше замовлення обробляється...</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    try {
        const res = await fetch(`${BOT_API_URL}/api/public/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (res.ok && data.success) {
            modal.querySelector('.modal-content').innerHTML = `
                <h2>✅ Замовлення оформлено!</h2>
                <div class="modal-message">
                    <p><strong>Замовлення #${data.order_id}</strong> успішно створено!</p>
                    <p>Наш менеджер вже отримав сповіщення та зв'яжеться з вами найближчим часом.</p>
                    <p>Ви також отримали підтвердження в Telegram.</p>
                </div>
                <div class="modal-actions">
                    <a href="https://t.me/SecureSuppor" target="_blank" class="telegram-btn" style="text-decoration:none;text-align:center;">
                        <i class="fab fa-telegram"></i> Зв'язатися з підтримкою
                    </a>
                    <button class="close-modal">Закрити</button>
                </div>
            `;
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.remove();
                goToHome();
            });
            modal.addEventListener('click', (e) => { if (e.target === modal) { modal.remove(); goToHome(); }});

            // Clear cart
            cart = [];
            updateCartCount();
            updateCartView();
            closeOrderMenu();
        } else {
            throw new Error(data.error || 'Помилка сервера');
        }
    } catch (err) {
        console.error('Order submit error:', err);
        modal.querySelector('.modal-content').innerHTML = `
            <h2>❌ Помилка</h2>
            <div class="modal-message">
                <p>На жаль, не вдалося оформити замовлення: ${err.message}</p>
                <p>Спробуйте ще раз або зв'яжіться з підтримкою.</p>
            </div>
            <div class="modal-actions">
                <a href="https://t.me/SecureSuppor" target="_blank" class="telegram-btn" style="text-decoration:none;text-align:center;">
                    <i class="fab fa-telegram"></i> Підтримка
                </a>
                <button class="close-modal">Закрити</button>
            </div>
        `;
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    }
}

function showFallbackOrderModal(items) {
    const orderId = 'O' + Date.now().toString().slice(-6);
    let commandParts = [];
    items.forEach(item => {
        let serviceAbbr;
        if (item.service.includes('Discord Прикраси')) serviceAbbr = "DisU";
        else if (item.service.includes('Discord Boosts')) serviceAbbr = "DisB";
        else if (item.service.includes('Discord')) serviceAbbr = "Dis";
        else if (item.service.includes('PicsArt')) serviceAbbr = "Pic";
        else if (item.service.includes('Canva')) serviceAbbr = "Can";
        else if (item.service.includes('Netflix')) serviceAbbr = "Net";
        else if (item.service.includes('PSN')) serviceAbbr = "PSN";
        else if (item.service.includes('Gemini')) serviceAbbr = "Gem";
        else if (item.service.includes('Adobe')) serviceAbbr = "Ado";
        else if (item.service.includes('Duolingo')) serviceAbbr = "Duo";
        else if (item.service.includes('YouTube')) serviceAbbr = "You";
        else serviceAbbr = item.service.substring(0, 3);

        let planAbbr, periodAbbr;
        if (serviceAbbr === "DisB") {
            const count = item.period.replace(/\D/g, '');
            planAbbr = `B${count}`;
            periodAbbr = "1шт";
        } else if (serviceAbbr === "PSN") {
            planAbbr = "INR";
            periodAbbr = "1шт";
        } else if (serviceAbbr === "DisU") {
            planAbbr = "Dec";
            periodAbbr = "1шт";
        } else {
            if (item.plan.includes('Basic')) planAbbr = "Bas";
            else if (item.plan.includes('Full')) planAbbr = "Ful";
            else if (item.plan.includes('Individual')) planAbbr = "Ind";
            else if (item.plan.includes('Family')) planAbbr = "Fam";
            else if (item.plan.includes('Plus')) planAbbr = "Plu";
            else if (item.plan.includes('Pro')) planAbbr = "Pro";
            else if (item.plan.includes('x5')) planAbbr = "X5";
            else if (item.plan.includes('Premium')) planAbbr = "Pre";
            else if (item.plan.includes('Teams')) planAbbr = "Tea";
            else if (item.plan.includes('Creative Cloud')) planAbbr = "CC";
            else if (item.plan.includes('GO')) planAbbr = "Go";
            else planAbbr = item.plan.substring(0, 3).toUpperCase();
            periodAbbr = item.period.includes('€') ? item.period : item.period.replace('місяць', 'м').replace('місяців', 'м').replace('місяці', 'м');
        }
        commandParts.push(`${serviceAbbr}-${planAbbr}-${periodAbbr}-${item.price}`);
    });

    const command = `/pay ${orderId} ${commandParts.join(' ')}`;
    const botUsername = "SecureShopBot";
    const telegramUrl = `https://t.me/${botUsername}`;

    const modal = document.createElement('div');
    modal.className = 'order-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Оформлення замовлення #${orderId}</h2>
            <div class="modal-message">
                <p>⚠️ Відкрийте міні-додаток через Telegram для автоматичного оформлення.</p>
                <p>Або скопіюйте команду та відправте її нашому боту:</p>
                <code>${command}</code>
            </div>
            <div class="modal-actions">
                <button class="copy-btn">Копіювати команду</button>
                <a href="${telegramUrl}" target="_blank" class="telegram-btn" style="text-decoration:none;text-align:center;">
                    <i class="fab fa-telegram"></i> Відкрити Telegram
                </a>
                <button class="close-modal">Закрити</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    modal.querySelector('.copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(command).then(() => {
            const btn = modal.querySelector('.copy-btn');
            btn.textContent = 'Скопійовано!';
            btn.disabled = true;
            btn.style.opacity = '0.7';
        }).catch(() => {
            showToast('Помилка копіювання', 'error');
        });
    });

    modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
}

function checkout() {
    if (cart.length === 0) {
        showToast('Кошик порожній!', 'info');
        return;
    }
    submitOrder([...cart]);
}

function orderSingleItem(index) {
    if (index >= cart.length) return;
    const item = cart[index];
    closeOrderMenu();
    submitOrder([item]).then(() => {
        // Item removed inside submitOrder on success
    });
}

// ═══════════════ Profile Page ═══════════════

async function loadProfile() {
    const container = document.getElementById('profile-container');
    if (!container) return;

    const userId = getTgUserId();

    if (!userId) {
        container.innerHTML = `
            <div class="profile-card">
                <div class="profile-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <h2>Гість</h2>
                <p class="profile-hint">Відкрийте міні-додаток через Telegram, щоб побачити свій профіль.</p>
                <a href="https://t.me/SecureShopBot" target="_blank" class="stub-button">
                    <i class="fab fa-telegram"></i> Відкрити в Telegram
                </a>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="profile-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Завантаження...</p>
        </div>
    `;

    try {
        const res = await fetch(`${BOT_API_URL}/api/public/profile?user_id=${userId}`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Помилка');
        }

        const user = data.user;
        const createdDate = user.created_at ? new Date(user.created_at).toLocaleDateString('uk-UA', {
            day: 'numeric', month: 'long', year: 'numeric'
        }) : '—';

        container.innerHTML = `
            <div class="profile-card">
                <div class="profile-avatar">
                    <span>${(user.first_name || '?').charAt(0).toUpperCase()}</span>
                </div>
                <h2>${user.first_name || ''} ${user.last_name || ''}</h2>
                ${user.username ? `<p class="profile-username">@${user.username}</p>` : ''}
                <p class="profile-date"><i class="fas fa-calendar-alt"></i> Клієнт з ${createdDate}</p>
            </div>
            <div class="profile-stats">
                <div class="stat-card">
                    <div class="stat-value">${data.orders_count}</div>
                    <div class="stat-label">Замовлень</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${data.total_spent} ₴</div>
                    <div class="stat-label">Витрачено</div>
                </div>
            </div>
            <button class="profile-orders-btn" onclick="navigateToSection('orders')">
                <i class="fas fa-box"></i> Мої замовлення
                <i class="fas fa-chevron-right" style="margin-left:auto;"></i>
            </button>
        `;
    } catch (err) {
        console.error('Profile load error:', err);
        container.innerHTML = `
            <div class="profile-card">
                <div class="profile-avatar">
                    <span>${getTgFirstName().charAt(0).toUpperCase() || '?'}</span>
                </div>
                <h2>${getTgFirstName() || 'Користувач'}</h2>
                ${getTgUsername() ? `<p class="profile-username">@${getTgUsername()}</p>` : ''}
                <p class="profile-hint">Не вдалося завантажити дані профілю. Спробуйте пізніше.</p>
            </div>
        `;
    }
}

// ═══════════════ Orders Page ═══════════════

async function loadOrders() {
    const container = document.getElementById('orders-container');
    if (!container) return;

    const userId = getTgUserId();

    if (!userId) {
        container.innerHTML = `
            <div class="orders-empty">
                <i class="fas fa-lock"></i>
                <p>Відкрийте міні-додаток через Telegram, щоб побачити свої замовлення.</p>
                <a href="https://t.me/SecureShopBot" target="_blank" class="stub-button">
                    <i class="fab fa-telegram"></i> Відкрити в Telegram
                </a>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="profile-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Завантаження...</p>
        </div>
    `;

    try {
        const res = await fetch(`${BOT_API_URL}/api/public/orders?user_id=${userId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Помилка');

        if (!data.orders || data.orders.length === 0) {
            container.innerHTML = `
                <div class="orders-empty">
                    <i class="fas fa-box-open"></i>
                    <p>У вас ще немає замовлень</p>
                    <button class="stub-button" onclick="navigateToSection('shop')">
                        <i class="fas fa-store"></i> Перейти до магазину
                    </button>
                </div>
            `;
            return;
        }

        let html = '';
        for (const order of data.orders) {
            const date = order.created_at ? new Date(order.created_at).toLocaleDateString('uk-UA', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            }) : '—';

            const statusMap = {
                'created': { text: 'Створено', class: 'status-created', icon: 'fas fa-clock' },
                'paid': { text: 'Оплачено', class: 'status-paid', icon: 'fas fa-check-circle' },
                'completed': { text: 'Виконано', class: 'status-completed', icon: 'fas fa-check-double' },
                'cancelled': { text: 'Скасовано', class: 'status-cancelled', icon: 'fas fa-times-circle' },
            };
            const status = statusMap[order.status] || statusMap['created'];

            const itemsHtml = (order.items || '').split('\n').filter(l => l.trim()).map(l => `<div class="order-item-line">${l}</div>`).join('');

            html += `
                <div class="order-card">
                    <div class="order-card-header">
                        <span class="order-id">#${order.order_id || order.id}</span>
                        <span class="order-status ${status.class}"><i class="${status.icon}"></i> ${status.text}</span>
                    </div>
                    <div class="order-card-body">
                        ${itemsHtml}
                    </div>
                    <div class="order-card-footer">
                        <span class="order-date"><i class="fas fa-calendar-alt"></i> ${date}</span>
                        <span class="order-total">${order.total_uah || 0} UAH</span>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    } catch (err) {
        console.error('Orders load error:', err);
        container.innerHTML = `
            <div class="orders-empty">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Не вдалося завантажити замовлення. Спробуйте пізніше.</p>
            </div>
        `;
    }
}
