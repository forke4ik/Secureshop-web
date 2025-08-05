// ===== ОБНОВИТЕ ФУНКЦИЮ checkout =====
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
        // Получаем CSRF-токен из мета-тега
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
        
        // Отправляем заказ на сервер
        const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken // Добавляем CSRF-токен
            },
            body: JSON.stringify({
                items: cart,
                total: total
            })
        });
        
        // Обрабатываем HTTP-ошибки
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            console.log("✅ Заказ сохранен, ID:", result.order_id);
            
            // Формируем ссылку для Telegram
            const botUsername = "secureshopBot";
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
            alert("Помилка збереження замовлення: " + (result.error || "Спробуйте ще раз"));
        }
    } catch (error) {
        console.error("🔥 Ошибка при отправке заказа:", error);
        alert("Сталася помилка: " + error.message);
    }
    
    console.groupEnd();
}

// ===== ОБНОВИТЕ ФУНКЦИЮ orderSingleItem =====
async function orderSingleItem() {
    const orderMenu = document.getElementById('order-menu');
    if (!orderMenu) return;
    
    const index = orderMenu.dataset.index;
    if (index >= 0 && index < cart.length) {
        const item = cart[index];
        
        try {
            // Получаем CSRF-токен из мета-тега
            const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
            
            // Отправляем единичный заказ на сервер
            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken // Добавляем CSRF-токен
                },
                body: JSON.stringify({
                    items: [item],
                    total: item.price
                })
            });
            
            // Обрабатываем HTTP-ошибки
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
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
                alert("Помилка: " + (result.error || "Спробуйте ще раз"));
            }
        } catch (error) {
            console.error("Ошибка при оформлении единичного товара:", error);
            alert("Сталася помилка: " + error.message);
        }
    }
}
