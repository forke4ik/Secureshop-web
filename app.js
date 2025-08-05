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

    import logging
import os
import asyncio
import threading
import time
import json
import re
from datetime import datetime
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, User, BotCommandScopeChat
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, filters, ContextTypes
from telegram.error import Conflict
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg
from psycopg.rows import dict_row
import io
from urllib.parse import unquote

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Глобальные переменные состояния
bot_running = False
bot_lock = threading.Lock()

# Конфигурация
BOT_TOKEN = os.getenv('BOT_TOKEN', '8181378677:AAFullvwrNhPJMi_HxgC75qSEKWdKOtCpbw')
OWNER_ID_1 = 7106925462  # @HiGki2pYYY
OWNER_ID_2 = 6279578957  # @oc33t
PORT = int(os.getenv('PORT', 8443))
WEBHOOK_URL = os.getenv('WEBHOOK_URL', 'https://secureshop-3obw.onrender.com')
PING_INTERVAL = int(os.getenv('PING_INTERVAL', 840))  # 14 минут
USE_POLLING = os.getenv('USE_POLLING', 'true').lower() == 'true'
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://neondb_owner:npg_1E2GxznybVCR@ep-super-pond-a2ce35gl-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require')

# Путь к файлу с данными
STATS_FILE = "bot_stats.json"

# Оптимизация: буферизация запросов к БД
BUFFER_FLUSH_INTERVAL = 300  # 5 минут
BUFFER_MAX_SIZE = 50
message_buffer = []
active_conv_buffer = []
user_cache = set()

# Оптимизация: кэш для истории сообщений
history_cache = {}

def flush_message_buffer():
    # ... (без изменений) ...

def flush_active_conv_buffer():
    # ... (без изменений) ...

def buffer_flush_thread():
    # ... (без изменений) ...

# Функции для работы с базой данных
def init_db():
    # ... (без изменений) ...

def ensure_user_exists(user):
    # ... (без изменений) ...

def save_message(user_id, message_text, is_from_user):
    # ... (без изменений) ...

def save_active_conversation(user_id, conversation_type, assigned_owner, last_message):
    # ... (без изменений) ...

def delete_active_conversation(user_id):
    # ... (без изменений) ...

def get_conversation_history(user_id, limit=50):
    # ... (без изменений) ...

def get_all_users():
    # ... (без изменений) ...

def get_total_users_count():
    # ... (без изменений) ...

# Инициализируем базу данных при старте
init_db()

# Запускаем поток для сброса буферов
threading.Thread(target=buffer_flush_thread, daemon=True).start()

# Функции для работы с данными
def load_stats():
    # ... (без изменений) ...

def default_stats():
    # ... (без изменений) ...

def save_stats():
    # ... (без изменений) ...

# Загружаем статистику
bot_statistics = load_stats()

# Словари для хранения данных
active_conversations = {}
owner_client_map = {}

# Глобальные переменные для приложения
telegram_app = None
flask_app = Flask(__name__)
CORS(flask_app)  # Разрешаем CORS для всех доменов

class TelegramBot:
    # ... (остальные методы без изменений) ...

    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /start с поддержкой deep linking с сайта"""
        user = update.effective_user
        
        # Гарантируем наличие пользователя в БД
        ensure_user_exists(user)
        
        # ПРОВЕРКА: Если команда /start была вызвана с параметрами (с сайту)
        if context.args:
            # Склеиваем аргументы в одну строку
            args_str = " ".join(context.args)
            
            # Расширенное логирование параметров
            logger.info(f"🔄 Получены параметры deep link от {user.id} ({user.first_name}):")
            logger.info(f"   Тип: {type(args_str)}")
            logger.info(f"   Длина: {len(args_str)} символов")
            logger.info(f"   Содержимое: '{args_str}'")
            
            # Если команда начинается с "pay", обрабатываем её
            if args_str.startswith("pay"):
                logger.info("🔎 Обнаружена команда pay в deep link, передаем в обработчик")
                # Имитируем вызов команды /pay
                context.args = [args_str]
                await self.pay_command(update, context)
                return
            
            logger.info(f"ℹ️ Параметры deep link не содержат команду pay")
        
        # ---- Обычный запуск /start без параметров ----
        # ... (остальной код без изменений) ...

    async def pay_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /pay для создания заказа"""
        user = update.effective_user
        user_id = user.id
        logger.info(f"🚀 Начало обработки команды /pay для пользователя {user_id} ({user.first_name})")
        
        # Гарантируем наличие пользователя в БД
        ensure_user_exists(user)
        
        # Парсим параметры команды
        try:
            if not context.args:
                logger.warning("⚠️ Команда /pay вызвана без аргументов")
                await update.message.reply_text(
                    "ℹ️ Для оплаты используйте команду в формате:\n"
                    "/pay service=<название> plan=<тариф> period=<период> price=<цена>\n\n"
                    "Например: /pay service=ChatGPT plan=Plus period=1 месяц price=650"
                )
                return
            
            # Собираем все аргументы в одну строку
            args_str = " ".join(context.args)
            
            # Логирование полученных аргументов
            logger.info(f"📩 Получены аргументы команды /pay:")
            logger.info(f"   Тип: {type(args_str)}")
            logger.info(f"   Длина: {len(args_str)} символов")
            logger.info(f"   Содержимое: '{args_str}'")
            
            # Если команда пришла из deep link (начинается с "pay")
            if args_str.startswith("pay"):
                args_str = args_str[3:].strip()
                logger.info(f"🔧 Обрезан префикс 'pay': '{args_str}'")
            
            # Декодируем URL-кодирование
            original_args = args_str
            args_str = unquote(args_str)
            logger.info(f"🔧 После декодирования URL: '{args_str}'")
            
            # Разбиваем на отдельные заказы
            orders = []
            if '_' in args_str:
                # Несколько товаров в заказе
                order_parts = args_str.split('_')
                logger.info(f"🔍 Найдено {len(order_parts)} частей заказа")
                
                for part in order_parts:
                    if 'service=' in part:
                        orders.append(part)
                        logger.info(f"   - Добавлен заказ: '{part}'")
            else:
                # Один товар в заказе
                logger.info("🔍 Найден один заказ")
                orders.append(args_str)
            
            logger.info(f"📦 Всего заказов для обработки: {len(orders)}")
            
            # Обрабатываем каждый заказ
            order_texts = []
            total_price = 0
            
            for i, order_str in enumerate(orders, 1):
                logger.info(f"🔧 Обработка заказа #{i}: '{order_str}'")
                
                # Парсим параметры с помощью регулярных выражений
                params = {}
                pattern = r'(\w+)=([^=:]+)'
                matches = re.findall(pattern, order_str)
                
                logger.info(f"   🔍 Найдено параметров: {len(matches)}")
                for key, value in matches:
                    params[key.lower()] = value.strip()
                    logger.info(f"      - {key} = {value.strip()}")
                
                # Проверяем обязательные параметры
                required = ['service', 'period', 'price']
                for param in required:
                    if param not in params:
                        error_msg = f"❌ Отсутствует обязательный параметр: {param}"
                        logger.warning(error_msg)
                        await update.message.reply_text(
                            f"{error_msg}\n\n"
                            "Пожалуйста, укажите все необходимые параметры."
                        )
                        return
                
                # Формируем текст заказа
                service = params.get('service', 'Неизвестный сервис')
                plan = params.get('plan', '')
                period = params.get('period', '')
                price = params.get('price', 0)
                
                try:
                    price_val = int(price)
                    total_price += price_val
                    logger.info(f"   💵 Цена успешно преобразована: {price_val} UAH")
                except ValueError:
                    error_msg = "❌ Неверный формат цены. Цена должна быть числом."
                    logger.error(error_msg)
                    await update.message.reply_text(error_msg)
                    return
                
                order_text = f"▫️ {service}"
                if plan:
                    order_text += f" {plan}"
                order_text += f" ({period}) - {price} UAH"
                order_texts.append(order_text)
                logger.info(f"   ✅ Сформирован текст заказа: '{order_text}'")
            
            # Формируем полный текст заказа
            full_order_text = "🛍️ Замовлення:\n\n" + "\n".join(order_texts)
            if len(orders) > 1:
                full_order_text += f"\n\n💳 Всього: {total_price} UAH"
            
            logger.info(f"📝 Полный текст заказа:\n{full_order_text}")
            
            # Создаем запись о заказе
            active_conversations[user_id] = {
                'type': 'order',
                'user_info': user,
                'assigned_owner': None,
                'order_details': full_order_text,
                'last_message': full_order_text,
                'from_website': True
            }
            
            logger.info("💾 Заказ сохранен в активных диалогах")
            
            # Сохраняем в БД
            save_active_conversation(user_id, 'order', None, full_order_text)
            logger.info("💾 Заказ сохранен в базе данных")
            
            # Обновляем статистику
            bot_statistics['total_orders'] += len(orders)
            save_stats()
            logger.info(f"📊 Статистика обновлена: total_orders = {bot_statistics['total_orders']}")
            
            # Пересылаем заказ обоим владельцам
            logger.info("📤 Пересылаем заказ владельцам...")
            await self.forward_order_to_owners(
                context, 
                user_id, 
                user, 
                full_order_text
            )
            
            logger.info("✅ Заказ успешно обработан")
            await update.message.reply_text(
                "✅ Ваше замовлення прийнято! Засновник магазину зв'яжеться з вами найближчим часом.\n\n"
                "Ви можете продовжити з іншим запитанням або замовленням."
            )
            
        except Exception as e:
            logger.error(f"🔥 Помилка обробки команди /pay: {e}", exc_info=True)
            logger.error(f"⚠️ Исходные аргументы: '{original_args}'")
            logger.error(f"⚠️ Декодированные аргументы: '{args_str}'")
            await update.message.reply_text(
                "❌ Сталася помилка при обробці вашого замовлення. Будь ласка, спробуйте ще раз."
            )
    
    # ... (остальные методы без изменений) ...

    async def forward_order_to_owners(self, context, client_id, client_info, order_text):
        """Пересылает заказ обоим владельцам"""
        logger.info(f"📨 Пересылаем заказ владельцам для клиента {client_id}")
        
        # Сохраняем последнее сообщение
        active_conversations[client_id]['last_message'] = order_text
        
        # Сохраняем в БД
        save_active_conversation(client_id, 'order', None, order_text)
        
        # Добавляем пометку о сайте, если заказ оттуда
        source = "з сайту" if active_conversations[client_id].get('from_website', False) else ""
        
        forward_message = f"""
🛒 НОВЕ ЗАМОВЛЕННЯ {source}!

👤 Клієнт: {client_info.first_name}
📱 Username: @{client_info.username if client_info.username else 'не вказано'}
🆔 ID: {client_info.id}
🌐 Язык: {client_info.language_code or 'не указан'}

📋 Деталі замовлення:
{order_text}

---
Нажмите "✅ Взять", чтобы обработать этот заказ.
        """
        
        keyboard = [
            [InlineKeyboardButton("✅ Взять", callback_data=f'take_order_{client_id}')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        # Отправляем обоим основателям
        for owner_id in [OWNER_ID_1, OWNER_ID_2]:
            try:
                logger.info(f"   📤 Отправляем заказ владельцу {owner_id}")
                await context.bot.send_message(
                    chat_id=owner_id,
                    text=forward_message.strip(),
                    reply_markup=reply_markup
                )
                logger.info(f"   ✅ Уведомление о заказе отправлено владельцу {owner_id}")
            except Exception as e:
                logger.error(f"❌ Ошибка отправки заказа основателю {owner_id}: {e}")

# ... (остальной код Flask и запуска без изменений) ...
    
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

function orderSingleItem() {
    const orderMenu = document.getElementById('order-menu');
    if (!orderMenu) return;
    
    const index = orderMenu.dataset.index;
    if (index >= 0 && index < cart.length) {
        const item = cart[index];
        createOrder([item]);
    }
}

// НОВАЯ ФУНКЦИЯ: оформление заказа через Telegram deep link
function checkout() {
    if (cart.length === 0) {
        alert('Корзина порожня!');
        return;
    }
    
    // Формируем параметры для команды /pay
    let payCommand = "pay";
    
    cart.forEach((item, index) => {
        // Для первого товара просто добавляем параметры
        // Для последующих - разделяем символом '_'
        const separator = index > 0 ? "_" : "";
        
        payCommand += `${separator}service=${encodeURIComponent(item.service)}`;
        if (item.plan) {
            payCommand += `:plan=${encodeURIComponent(item.plan)}`;
        }
        payCommand += `:period=${encodeURIComponent(item.period)}`;
        payCommand += `:price=${item.price}`;
    });
    
    // Формируем читаемое сообщение для пользователя
    let userMessage = "🛒 Ваше замовлення:\n\n";
    let total = 0;
    
    cart.forEach(item => {
        userMessage += `▫️ ${item.service} ${item.plan || ''} (${item.period}) - ${item.price} UAH\n`;
        total += item.price;
    });
    
    userMessage += `\n💳 Всього: ${total} UAH`;
    
    // Формируем ссылку для Telegram
    const botUsername = "secureshopBot"; // Замените на реальное имя бота
    const telegramUrl = `https://t.me/${botUsername}?start=${payCommand}`;
    
    // Показываем подтверждение
    const confirmSend = confirm(`${userMessage}\n\nНатисніть OK, щоб відправити замовлення боту.`);
    
    if (confirmSend) {
        window.open(telegramUrl, '_blank');
        
        // Очищаем корзину
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartView();
        showPage(servicesPage);
    }
}

// НОВАЯ ФУНКЦИЯ: создание заказа для одного товара
function createOrder(items) {
    // Формируем параметры для команды /pay
    let payCommand = "pay";
    
    items.forEach((item, index) => {
        // Для первого товара просто добавляем параметры
        // Для последующих - разделяем символом '_'
        const separator = index > 0 ? "_" : "";
        
        payCommand += `${separator}service=${encodeURIComponent(item.service)}`;
        if (item.plan) {
            payCommand += `:plan=${encodeURIComponent(item.plan)}`;
        }
        payCommand += `:period=${encodeURIComponent(item.period)}`;
        payCommand += `:price=${item.price}`;
    });
    
    // Формируем читаемое сообщение для пользователя
    let userMessage = "🛒 Ваше замовлення:\n\n";
    let total = 0;
    
    items.forEach(item => {
        userMessage += `▫️ ${item.service} ${item.plan || ''} (${item.period}) - ${item.price} UAH\n`;
        total += item.price;
    });
    
    if (items.length > 1) {
        userMessage += `\n💳 Всього: ${total} UAH`;
    }
    
    // Формируем ссылку для Telegram
    const botUsername = "secureshopBot"; // Замените на реальное имя бота
    const telegramUrl = `https://t.me/${botUsername}?start=${payCommand}`;
    
    // Показываем подтверждение
    const confirmSend = confirm(`${userMessage}\n\nНатисніть OK, щоб відправити замовлення боту.`);
    
    if (confirmSend) {
        window.open(telegramUrl, '_blank');
        
        // Удаляем товар из корзины
        const orderMenu = document.getElementById('order-menu');
        if (orderMenu) {
            const index = orderMenu.dataset.index;
            if (index >= 0 && index < cart.length) {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                updateCartView();
            }
        }
        
        closeOrderMenu();
    }
}
