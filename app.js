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

function getServiceIdByObject(serviceObj) {
    if (!serviceObj) return '';
    if (serviceObj === discordDecorProducts) return 'discord_decor';
    if (serviceObj === discordBoostsProducts) return 'discord_boosts';
    for (const [key, val] of Object.entries(products)) {
        if (val === serviceObj) return key;
    }
    return '';
}

// ═══════════════ DOM Elements ═══════════════
const mainPage = document.getElementById('main-page');
const subscriptionsPage = document.getElementById('subscriptions-page');
const digitalPage = document.getElementById('digital-page');
const discordDecorTypePage = document.getElementById('discord-decor-type-page');
const plansPage = document.getElementById('plans-page');
const optionsPage = document.getElementById('options-page');
const productPage = document.getElementById('product-page');
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

// Product page state
let _productPageData = null;
let _productPagePrevPage = null;

document.addEventListener('DOMContentLoaded', function() {
    renderServiceCards();
    setupEventListeners();
    setupBottomNav();
    setupReviewModal();
    showPage(mainPage);
    updateCartCount();
    setupHeaderScroll();
    setupKeyboardSupport();
    setupGestures();
    loadLatestReviews();
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

// ═══════════════ Gestures (Swipe Back) ═══════════════
function setupGestures() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        // Swipe right (Back gesture)
        // Start from left edge (x < 50) and swipe distance > 80
        if (touchStartX < 50 && (touchEndX - touchStartX > 80)) {
            goBackAutomatically();
        }
    }
}

function goBackAutomatically() {
    if (productPage && productPage.classList.contains('active')) {
        goBackFromProduct();
    } else if (discordDecorTypePage.classList.contains('active') || plansPage.classList.contains('active')) {
        goBackToServices();
    } else if (optionsPage.classList.contains('active')) {
        goBackToPlans();
    } else if (subscriptionsPage.classList.contains('active') || digitalPage.classList.contains('active') || cartPage.classList.contains('active')) {
        goToHome();
    }
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
    // Toggle product sticky footer
    const stickyFooter = document.querySelector('.product-sticky-footer');
    if (stickyFooter) {
        stickyFooter.style.display = (pageToShow === productPage) ? 'block' : 'none';
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
        'back-from-product': goBackFromProduct,
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
            addToCartBtn.textContent = 'Детальніше';
            addToCartBtn.addEventListener('click', function() {
                const serviceKey = getServiceIdByObject(currentService);
                const warranty = option.warranty || plan.warranty || currentService.warranty || null;
                showProductPage(currentService.name, currentPlan.name, option, warranty, serviceKey, currentService.logo, plan.description);
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
            addToCartBtn.textContent = 'Детальніше';
            addToCartBtn.addEventListener('click', function() {
                const serviceKey = 'discord_decor';
                const warranty = option.warranty || plan.warranty || currentService.warranty || null;
                showProductPage(currentService.name, currentPlan.name, option, warranty, serviceKey, currentService.logo, plan.description);
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

function addItemToCart(period, price, warranty) {
    if (!currentService || !currentPlan) {
        showToast('Спочатку оберіть сервіс і тариф!', 'error');
        return;
    }

    const item = {
        service: currentService.name,
        plan: currentPlan.name,
        period: period,
        price: price,
        warranty: warranty || currentService.warranty || null
    };

    cart.push(item);
    updateCartCount();
    showToast('Товар додано до кошика! 🎉');
}

function addItemToCartDirect(serviceName, planName, period, price, warranty) {
    const item = {
        service: serviceName,
        plan: planName,
        period: period,
        price: price,
        warranty: warranty || null
    };
    cart.push(item);
    updateCartCount();
    showToast('Товар додано до кошика! 🎉');
}

// ═══════════════ Product Page ═══════════════

function showProductPage(serviceName, planName, option, warranty, serviceKey, logo, description) {
    _productPageData = { serviceName, planName, option, warranty, serviceKey };
    // Remember which page we came from
    _productPagePrevPage = document.querySelector('.page.active');

    // Fill hero
    const logoEl = document.getElementById('product-logo');
    if (logoEl) {
        if (logo) {
            logoEl.innerHTML = `<img src="${logo}" alt="${serviceName}" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'logo-letter',textContent:'${serviceName.charAt(0)}'}))"/>`;
        } else {
            logoEl.innerHTML = `<span class="logo-letter">${serviceName.charAt(0)}</span>`;
        }
    }
    const titleEl = document.getElementById('product-title');
    if (titleEl) titleEl.textContent = `${serviceName} — ${planName}`;
    const subtitleEl = document.getElementById('product-subtitle');
    if (subtitleEl) subtitleEl.textContent = option.period;
    const priceEl = document.getElementById('product-price-badge');
    if (priceEl) priceEl.textContent = `${option.price} UAH`;

    // Description
    const descEl = document.getElementById('product-description');
    if (descEl) descEl.textContent = description || `${serviceName} — ${planName}. Преміум доступ до сервісу.`;

    // Specs
    const specsEl = document.getElementById('product-specs');
    if (specsEl) {
        let productType = 'Цифрова підписка';
        if (serviceKey === 'discord_decor' || serviceKey === 'discord_boosts') productType = 'Цифровий товар';
        if (serviceKey === 'psn') productType = 'Подарункова картка';

        let deliveryMethod = 'Промокод / Запрошення';
        if (serviceKey === 'psn') deliveryMethod = 'Код активації';
        if (serviceKey === 'discord_decor') deliveryMethod = 'Активація оператором';
        if (serviceKey === 'discord_boosts') deliveryMethod = 'Активація на сервер';

        specsEl.innerHTML = `
            <div class="spec-row">
                <span class="spec-label"><i class="fas fa-tag"></i> Тип</span>
                <span class="spec-value">${productType}</span>
            </div>
            <div class="spec-row">
                <span class="spec-label"><i class="fas fa-clock"></i> Період</span>
                <span class="spec-value">${option.period}</span>
            </div>
            <div class="spec-row">
                <span class="spec-label"><i class="fas fa-coins"></i> Ціна</span>
                <span class="spec-value">${option.price} UAH</span>
            </div>
            <div class="spec-row">
                <span class="spec-label"><i class="fas fa-truck"></i> Доставка</span>
                <span class="spec-value">${deliveryMethod}</span>
            </div>
            <div class="spec-row">
                <span class="spec-label"><i class="fas fa-bolt"></i> Швидкість</span>
                <span class="spec-value">5-30 хв</span>
            </div>
        `;
    }

    // Warranty
    const warrantySection = document.getElementById('product-warranty-section');
    const warrantyText = document.getElementById('product-warranty-text');
    if (warranty) {
        if (warrantySection) warrantySection.style.display = '';
        if (warrantyText) warrantyText.textContent = warranty;
    } else {
        if (warrantySection) warrantySection.style.display = 'none';
    }

    // Add to cart button
    const addBtn = document.getElementById('product-add-to-cart-btn');
    if (addBtn) {
        addBtn.classList.remove('added');
        addBtn.innerHTML = '<i class="fas fa-cart-plus"></i> Додати в кошик';
        // Remove old listeners by cloning
        const newBtn = addBtn.cloneNode(true);
        addBtn.parentNode.replaceChild(newBtn, addBtn);
        newBtn.addEventListener('click', function() {
            addItemToCartDirect(serviceName, planName, option.period, option.price, warranty);
            newBtn.classList.add('added');
            newBtn.innerHTML = '<i class="fas fa-check"></i> Додано!';
            setTimeout(() => {
                newBtn.classList.remove('added');
                newBtn.innerHTML = '<i class="fas fa-cart-plus"></i> Додати в кошик';
            }, 1500);
        });
    }

    // Load product reviews
    loadProductReviews(serviceName);

    showPage(productPage);
}

function goBackFromProduct() {
    if (_productPagePrevPage) {
        showPage(_productPagePrevPage);
    } else {
        goToHome();
    }
    _productPageData = null;
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
                    <p>Наш менеджер вже отримав сповіщення. Натисніть на кнопку нижче, щоб перейти до наступного этапу замовлення.</p>
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

        // Load user's existing reviews to check which orders have been reviewed
        let userReviews = [];
        try {
            const revRes = await fetch(`${BOT_API_URL}/api/public/reviews?limit=50`);
            const revData = await revRes.json();
            userReviews = (revData.reviews || []).filter(r => r.user_id == userId);
        } catch (e) { /* ignore */ }
        const reviewedOrderIds = new Set(userReviews.map(r => r.order_id));

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

            // Parse service name from items for review
            const itemLines = (order.items || '').split('\n').filter(l => l.trim());
            let serviceName = '';
            let planName = '';
            if (itemLines.length > 0) {
                const match = itemLines[0].match(/▫️\s*(.+?)\s+(.+?)\s*\(/);
                if (match) {
                    serviceName = match[1].trim();
                    planName = match[2].trim();
                }
            }

            const orderId = order.order_id || String(order.id);
            const canReview = ['paid', 'completed'].includes(order.status);
            const alreadyReviewed = reviewedOrderIds.has(orderId);

            let reviewBtnHtml = '';
            if (canReview && alreadyReviewed) {
                reviewBtnHtml = `<button class="order-review-btn reviewed" disabled><i class="fas fa-check"></i> Відгук залишено</button>`;
            } else if (canReview) {
                reviewBtnHtml = `<button class="order-review-btn" onclick="openReviewModal('${orderId}','${serviceName.replace(/'/g,"\\'")}','${planName.replace(/'/g,"\\'")}')">
                    <i class="fas fa-star"></i> Залишити відгук
                </button>`;
            }

            html += `
                <div class="order-card">
                    <div class="order-card-header">
                        <span class="order-id">#${orderId}</span>
                        <span class="order-status ${status.class}"><i class="${status.icon}"></i> ${status.text}</span>
                    </div>
                    <div class="order-card-body">
                        ${itemsHtml}
                    </div>
                    <div class="order-card-footer">
                        <span class="order-date"><i class="fas fa-calendar-alt"></i> ${date}</span>
                        <span class="order-total">${order.total_uah || 0} UAH</span>
                    </div>
                    ${reviewBtnHtml}
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

// ═══════════════ Reviews System ═══════════════

let _reviewModalRating = 0;
let _reviewModalOrderId = '';
let _reviewModalServiceName = '';
let _reviewModalPlanName = '';

function setupReviewModal() {
    const stars = document.querySelectorAll('#review-stars-input .review-star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            _reviewModalRating = parseInt(this.dataset.rating);
            updateReviewStars();
        });
    });

    const closeBtn = document.getElementById('review-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeReviewModal);

    const overlay = document.getElementById('review-modal-overlay');
    if (overlay) overlay.addEventListener('click', function(e) {
        if (e.target === this) closeReviewModal();
    });

    const submitBtn = document.getElementById('review-submit-btn');
    if (submitBtn) submitBtn.addEventListener('click', submitReview);
}

function updateReviewStars() {
    const stars = document.querySelectorAll('#review-stars-input .review-star');
    const ratingLabels = ['', 'Жахливо', 'Погано', 'Нормально', 'Добре', 'Чудово'];
    stars.forEach(star => {
        const r = parseInt(star.dataset.rating);
        star.classList.toggle('active', r <= _reviewModalRating);
    });
    const label = document.getElementById('review-rating-label');
    if (label) label.textContent = _reviewModalRating > 0 ? ratingLabels[_reviewModalRating] : 'Оберіть оцінку';
}

function openReviewModal(orderId, serviceName, planName) {
    _reviewModalOrderId = orderId;
    _reviewModalServiceName = serviceName;
    _reviewModalPlanName = planName;
    _reviewModalRating = 0;
    updateReviewStars();

    const serviceEl = document.getElementById('review-modal-service');
    if (serviceEl) serviceEl.textContent = `${serviceName} ${planName}`;

    const textInput = document.getElementById('review-text-input');
    if (textInput) textInput.value = '';

    const overlay = document.getElementById('review-modal-overlay');
    if (overlay) overlay.classList.add('active');
}

function closeReviewModal() {
    const overlay = document.getElementById('review-modal-overlay');
    if (overlay) overlay.classList.remove('active');
}

async function submitReview() {
    const userId = getTgUserId();
    if (!userId) {
        showToast('Відкрийте через Telegram', 'error');
        return;
    }
    if (_reviewModalRating === 0) {
        showToast('Оберіть оцінку (зірочки)', 'error');
        return;
    }
    const textInput = document.getElementById('review-text-input');
    const text = textInput ? textInput.value.trim() : '';
    if (!text) {
        showToast('Напишіть текст відгуку', 'error');
        return;
    }

    const submitBtn = document.getElementById('review-submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Надсилання...';
    }

    try {
        const res = await fetch(`${BOT_API_URL}/api/public/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                username: getTgUsername(),
                first_name: getTgFirstName(),
                order_id: _reviewModalOrderId,
                service_name: _reviewModalServiceName,
                plan_name: _reviewModalPlanName,
                rating: _reviewModalRating,
                text: text,
            }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Помилка');

        showToast('Дякуємо за відгук! ⭐');
        closeReviewModal();
        loadOrders(); // Refresh to show "reviewed" badge
        loadLatestReviews();
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Надіслати відгук';
        }
    }
}

function renderReviewStars(rating) {
    let html = '<div class="review-stars">';
    for (let i = 1; i <= 5; i++) {
        html += `<i class="fas fa-star ${i <= rating ? 'active' : ''}"></i>`;
    }
    html += '</div>';
    return html;
}

function renderReviewCard(review) {
    const name = review.first_name || review.username || 'Користувач';
    const initial = name.charAt(0).toUpperCase();
    const date = review.created_at ? new Date(review.created_at).toLocaleDateString('uk-UA', {
        day: 'numeric', month: 'short', year: 'numeric'
    }) : '';
    return `
        <div class="review-card">
            <div class="review-card-header">
                <div class="review-avatar">${initial}</div>
                <div class="review-meta">
                    <div class="review-name">${name}</div>
                    <div class="review-service-label">${review.service_name || ''} ${review.plan_name || ''}</div>
                </div>
                <div class="review-date">${date}</div>
            </div>
            ${renderReviewStars(review.rating)}
            <div class="review-text">${review.text || ''}</div>
        </div>
    `;
}

async function loadLatestReviews() {
    const container = document.getElementById('latest-reviews-list');
    if (!container) return;
    try {
        const res = await fetch(`${BOT_API_URL}/api/public/reviews?limit=5`);
        const data = await res.json();
        const reviews = data.reviews || [];
        if (reviews.length === 0) {
            container.innerHTML = '<div class="reviews-empty"><i class="fas fa-comment-slash"></i><p>Відгуків поки немає</p></div>';
        } else {
            container.innerHTML = reviews.map(r => renderReviewCard(r)).join('');
        }
    } catch (err) {
        container.innerHTML = '<div class="reviews-empty"><p>Не вдалося завантажити відгуки</p></div>';
    }
}

async function loadProductReviews(serviceName) {
    const container = document.getElementById('product-reviews-list');
    if (!container) return;
    container.innerHTML = '<div class="profile-loading"><i class="fas fa-spinner fa-spin"></i><p>Завантаження відгуків...</p></div>';
    try {
        const res = await fetch(`${BOT_API_URL}/api/public/reviews?service_name=${encodeURIComponent(serviceName)}&limit=10`);
        const data = await res.json();
        const reviews = data.reviews || [];
        if (reviews.length === 0) {
            container.innerHTML = '<div class="reviews-empty"><i class="fas fa-comment-slash"></i><p>Відгуків для цього товару ще немає</p></div>';
        } else {
            container.innerHTML = reviews.map(r => renderReviewCard(r)).join('');
        }
    } catch (err) {
        container.innerHTML = '<div class="reviews-empty"><p>Не вдалося завантажити відгуки</p></div>';
    }
}
