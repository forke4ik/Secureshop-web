// app.js - Обновленная версия с поддержкой нового формата /pay
// для совместимости с main.py

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
const cartPage = document.getElementById('cart-page');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const backButton = document.getElementById('back-button');
const cartCountElement = document.getElementById('cart-count');
const orderMenu = document.getElementById('order-menu');
const orderItemsContainer = document.getElementById('order-items');
const orderTotalElement = document.getElementById('order-total');
const closeOrderMenuButton = document.getElementById('close-order-menu');

// --- ОБНОВЛЕННЫЕ ФУНКЦИИ ---

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    cartCountElement.style.display = totalItems > 0 ? 'block' : 'none';
}

function updateCartView() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Кошик порожній</p>';
        cartTotalElement.textContent = '0 грн';
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.service} - ${item.plan}</h4>
                <p>Термін: ${item.period}</p>
                <p>Ціна: ${item.price} грн</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="changeQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${index})">Видалити</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotalElement.textContent = `${total} грн`;
}

function addToCart() {
    if (!currentService || !currentPlan) {
        alert('Будь ласка, оберіть сервіс та план.');
        return;
    }

    // Получаем выбранные опции
    const selectedOptions = [];
    const optionsContainer = document.querySelector('.options-container');
    if (optionsContainer) {
        const checkboxes = optionsContainer.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            selectedOptions.push(checkbox.value);
        });
    }

    // Создаем уникальный идентификатор для товара в корзине
    // Включаем service, plan, period и selectedOptions для различия
    const uniqueId = `${currentService.name}-${currentPlan.id}-${currentPlan.period}-${selectedOptions.sort().join('-')}`;

    const existingItemIndex = cart.findIndex(item => item.uniqueId === uniqueId);

    if (existingItemIndex !== -1) {
        // Если товар уже есть, увеличиваем количество
        cart[existingItemIndex].quantity += 1;
    } else {
        // Если товар новый, добавляем его в корзину
        cart.push({
            uniqueId: uniqueId,
            service: currentService.name,
            plan: currentPlan.name,
            period: currentPlan.period,
            price: currentPlan.price,
            quantity: 1,
            options: selectedOptions
        });
    }

    updateCartCount();
    updateCartView();
    alert('Товар додано до кошика!');
    resetSelection();
    showPage(mainPage);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCartView();
}

function changeQuantity(index, change) {
    const newQuantity = cart[index].quantity + change;
    if (newQuantity > 0) {
        cart[index].quantity = newQuantity;
    } else {
        removeFromCart(index);
    }
    updateCartView();
}

function openCart() {
    updateCartView();
    showPage(cartPage);
}

function closeCart() {
    showPage(mainPage);
}

function showOrderMenu() {
    if (cart.length === 0) {
        alert('Ваш кошик порожній!');
        return;
    }

    orderItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const orderItemElement = document.createElement('div');
        orderItemElement.className = 'order-item';
        orderItemElement.innerHTML = `
            <h4>${item.service} - ${item.plan}</h4>
            <p>Термін: ${item.period}</p>
            <p>Ціна: ${item.price} грн x ${item.quantity}</p>
            <p><strong>Разом: ${itemTotal} грн</strong></p>
            ${item.options.length > 0 ? `<p>Опції: ${item.options.join(', ')}</p>` : ''}
            <hr>
        `;
        orderItemsContainer.appendChild(orderItemElement);
    });

    orderTotalElement.textContent = `${total} грн`;
    orderMenu.style.display = 'block';
}

function closeOrderMenu() {
    orderMenu.style.display = 'none';
}

// --- ОБНОВЛЕННАЯ ФУНКЦИЯ ОФОРМЛЕНИЯ ЗАКАЗА ---
function checkout() {
    console.log("Оформление заказа");
    if (cart.length === 0) {
        alert('Ваша корзина порожня!');
        return;
    }

    // Генерируем уникальный orderID, например, на основе времени
    const orderId = `order_${Math.floor(Date.now() / 1000)}`; // order_1731800000

    // Формируем аргументы для каждого товара
    let orderItems = [];
    cart.forEach(item => {
        // ВАЖНО: Заменяем пробелы в period и других полях на подчеркивания
        // Это необходимо для корректного парсинга в боте
        let safeService = item.service.replace(/\s+/g, '_');
        let safePlan = item.plan.replace(/\s+/g, '_');
        let safePeriod = item.period.replace(/\s+/g, '_'); // Заменяем пробелы на _

        // Формат: service_plan_period_price
        let itemString = `${safeService}_${safePlan}_${safePeriod}_${item.price}`;
        orderItems.push(itemString);
    });

    // Собираем полную команду
    // Формат: /pay <order_id> <item1> <item2> ...
    const payCommand = `/pay ${orderId} ${orderItems.join(' ')}`;

    console.log("Сформирована команда /pay:", payCommand);

    // --- Показать модальное окно с командой для копирования ---
    const message = `Ваше замовлення готове!\n\nБудь ласка, скопіюйте команду нижче та вставте її в чат з нашим ботом @YourBotUsername:\n\n${payCommand}`;
    showModal(message, payCommand); // Предполагается, что функция showModal существует

    // Очищаем корзину после оформления
    // cart = []; // Не очищаем сразу, чтобы можно было повторно скопировать
    // updateCartCount();
    // updateCartView();
    // closeCart(); // Закрываем корзину, если она открыта
}

// --- ФУНКЦИЯ ПОКАЗА МОДАЛЬНОГО ОКНА ---
function showModal(message, command) {
    // Удаляем предыдущее модальное окно, если оно есть
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        document.body.removeChild(existingModal);
    }

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal-btn">&times;</span>
            <div class="modal-message">${message}</div>
            <div class="modal-actions">
                <button class="copy-btn">Копіювати команду</button>
                <button class="telegram-btn">Відкрити Telegram</button>
                <button class="close-modal-btn-secondary">Закрити</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const closeModalBtn = modal.querySelector('.close-modal-btn');
    const closeModalBtnSecondary = modal.querySelector('.close-modal-btn-secondary');
    const copyBtn = modal.querySelector('.copy-btn');
    const telegramBtn = modal.querySelector('.telegram-btn');
    const telegramUrl = `https://t.me/YourBotUsername`; // <<< ЗАМЕНИТЕ НА РЕАЛЬНОЕ ИМЯ БОТА

    const closeModalFunc = () => {
        document.body.removeChild(modal);
    };

    closeModalBtn.onclick = closeModalFunc;
    closeModalBtnSecondary.onclick = closeModalFunc;
    window.onclick = (event) => {
        if (event.target == modal) {
            closeModalFunc();
        }
    };

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(command).then(() => {
            alert('Команду скопійовано!');
            // После копирования можно очистить корзину
            cart = [];
            updateCartCount();
            updateCartView();
            closeCart();
            closeModalFunc();
        }).catch(err => {
            console.error('Помилка копіювання:', err);
            alert('Не вдалося скопіювати команду. Спробуйте ще раз.');
        });
    };

    telegramBtn.onclick = () => {
        window.open(telegramUrl, '_blank');
        // После открытия Telegram можно очистить корзину
        cart = [];
        updateCartCount();
        updateCartView();
        closeCart();
        closeModalFunc();
    };
}


// --- НАВИГАЦИЯ ---
function showPage(page) {
    // Скрываем все страницы
    mainPage.style.display = 'none';
    subscriptionsPage.style.display = 'none';
    digitalPage.style.display = 'none';
    discordDecorTypePage.style.display = 'none';
    plansPage.style.display = 'none';
    cartPage.style.display = 'none';

    // Показываем нужную страницу
    page.style.display = 'block';

    // Обновляем кнопку "Назад"
    updateBackButton();
}

function updateBackButton() {
    // Определяем, на какой странице мы находимся, и устанавливаем действие кнопки "Назад"
    if (document.querySelector('.page[style*="block"]') === subscriptionsPage ||
        document.querySelector('.page[style*="block"]') === digitalPage) {
        backButton.onclick = () => showPage(mainPage);
        backButton.style.display = 'block';
    } else if (document.querySelector('.page[style*="block"]') === discordDecorTypePage) {
        backButton.onclick = () => showPage(digitalPage);
        backButton.style.display = 'block';
    } else if (document.querySelector('.page[style*="block"]') === plansPage) {
        if (currentService === discordDecorProducts) {
            backButton.onclick = () => showPage(discordDecorTypePage);
        } else {
            backButton.onclick = () => showPage(subscriptionsPage);
        }
        backButton.style.display = 'block';
    } else if (document.querySelector('.page[style*="block"]') === cartPage) {
        backButton.onclick = () => showPage(mainPage);
        backButton.style.display = 'block';
    } else {
        backButton.style.display = 'none';
    }
}

function goBack() {
    // Эта функция теперь управляется updateBackButton
    // Можно оставить пустой или удалить, если кнопка "Назад" всегда обновляется
}

function selectService(service) {
    console.log("Выбран сервис:", service.name);
    currentService = service;

    if (service === discordDecorProducts) {
        showPage(discordDecorTypePage);
    } else {
        showPlans(service);
    }
}

function selectDiscordDecorType(type) {
    console.log("Выбран тип прикрас:", type);
    // Находим план в discordDecorProducts по id
    const selectedPlan = discordDecorProducts.plans.find(plan => plan.id === type);
    if (selectedPlan) {
        currentPlan = selectedPlan;
        showPlans(discordDecorProducts); // Показываем "планы" (список товаров) для прикрас
    } else {
        alert("Помилка вибору типу прикрас.");
    }
}

function showPlans(service) {
    console.log("Отображение планов для:", service.name);
    const plansContainer = document.getElementById('plans-container');
    plansContainer.innerHTML = ''; // Очищаем контейнер

    // Устанавливаем заголовок и описание
    document.getElementById('plans-service-name').textContent = service.name;
    document.getElementById('plans-service-description').textContent = service.description || '';

    // Заполняем контейнер планами
    service.plans.forEach(plan => {
        const planElement = document.createElement('div');
        planElement.className = 'plan';
        // Формируем HTML для плана, включая периоды
        let planHTML = `<h3>${plan.name}</h3><p>${plan.description || ''}</p><ul>`;
        if (plan.periods && plan.periods.length > 0) {
            plan.periods.forEach(periodObj => {
                planHTML += `<li><button onclick="selectPeriod('${plan.id}', '${periodObj.period}', ${periodObj.price})">${periodObj.period} - ${periodObj.price} грн</button></li>`;
            });
        } else {
            // Если периоды не определены, показываем кнопку с базовой ценой
            planHTML += `<li><button onclick="selectPeriod('${plan.id}', 'Не вказано', ${plan.price})">Ціна: ${plan.price} грн</button></li>`;
        }
        planHTML += `</ul>`;
        planElement.innerHTML = planHTML;
        plansContainer.appendChild(planElement);
    });

    showPage(plansPage);
}

function selectPeriod(planId, period, price) {
    console.log(`Выбран период: ${period} за ${price} грн для плана ${planId}`);
    // Находим выбранный план в currentService
    const selectedPlan = currentService.plans.find(plan => plan.id === planId);
    if (selectedPlan) {
        // Создаем временный объект плана с выбранным периодом и ценой
        currentPlan = {
            ...selectedPlan,
            period: period,
            price: price
        };

        // Проверяем, есть ли у плана дополнительные опции
        const optionsContainer = document.querySelector('.options-container');
        if (optionsContainer) {
            optionsContainer.innerHTML = ''; // Очищаем контейнер опций
            if (selectedPlan.options && selectedPlan.options.length > 0) {
                // Создаем чекбоксы для опций
                const optionsHTML = selectedPlan.options.map(option =>
                    `<label><input type="checkbox" value="${option}"> ${option}</label>`
                ).join('<br>');
                optionsContainer.innerHTML = `<h4>Додаткові опції:</h4>${optionsHTML}`;
                optionsContainer.style.display = 'block';
            } else {
                optionsContainer.style.display = 'none';
            }
        }

        // Переходим на страницу выбора опций (или сразу к добавлению в корзину, если опций нет)
        // Для упрощения, предположим, что опции всегда есть или их обработка происходит на plansPage
        // В реальном приложении может потребоваться отдельная страница
        alert(`Ви обрали: ${currentService.name} - ${selectedPlan.name}\nТермін: ${period}\nЦіна: ${price} грн\nБудь ласка, оберіть опції (якщо є) і натисніть "Додати до кошика".`);
    }
}

function goBackToMain() {
    console.log("Назад на главную");
    resetSelection();
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
    // - ИСПРАВЛЕНИЕ: Очистка правильных контейнеров -
    const subscriptionOptionsContainer = document.querySelector('.subscription-options-container'); // Убедитесь, что этот элемент существует
    const discordOptionsContainer = document.querySelector('.discord-options-container'); // Убедитесь, что этот элемент существует
    const plansContainer = document.getElementById('plans-container');
    if (subscriptionOptionsContainer) subscriptionOptionsContainer.innerHTML = '';
    if (discordOptionsContainer) discordOptionsContainer.innerHTML = '';
    if (plansContainer) plansContainer.innerHTML = '';
    // - КОНЕЦ ИСПРАВЛЕНИЯ -
}

function resetDiscordDecorUI() {
    // Сбрасываем состояние UI для Discord прикрас, если необходимо
    // Например, снимаем выделение с кнопок типов
    const typeButtons = discordDecorTypePage.querySelectorAll('.decor-type-btn');
    typeButtons.forEach(btn => btn.classList.remove('selected'));
}


// --- ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация отображения
    showPage(mainPage);
    updateCartCount();

    // Добавляем обработчики событий для кнопок категорий на главной странице
    document.getElementById('subscriptions-btn').addEventListener('click', () => showPage(subscriptionsPage));
    document.getElementById('digital-btn').addEventListener('click', () => showPage(digitalPage));

    // Добавляем обработчики событий для кнопок сервисов
    // Предполагается, что у кнопок есть data-service-id
    const serviceButtons = document.querySelectorAll('[data-service-id]');
    serviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const serviceId = button.getAttribute('data-service-id');
            const service = products.find(p => p.id === serviceId);
            if (service) {
                selectService(service);
            }
        });
    });

    // Добавляем обработчики событий для кнопок типов Discord прикрас
    const decorTypeButtons = document.querySelectorAll('.decor-type-btn');
    decorTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Визуальная обратная связь
            decorTypeButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            const typeId = button.getAttribute('data-type-id');
            selectDiscordDecorType(typeId);
        });
    });

    // Добавляем обработчики событий для кнопок навигации
    document.getElementById('back-button').addEventListener('click', goBack);
    document.getElementById('cart-btn').addEventListener('click', openCart);
    document.getElementById('close-cart').addEventListener('click', closeCart);
    document.getElementById('proceed-to-checkout').addEventListener('click', showOrderMenu);
    document.getElementById('place-order').addEventListener('click', checkout);
    closeOrderMenuButton.addEventListener('click', closeOrderMenu);

    // Закрытие модального окна заказа по клику вне его
    window.addEventListener('click', (event) => {
        if (event.target === orderMenu) {
            closeOrderMenu();
        }
    });
});

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (если еще не определены) ---
// Убедитесь, что функции showPage, updateBackButton и другие вспомогательные функции определены выше
// или импортированы из другого файла.
