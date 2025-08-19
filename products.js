// products.js
// Додамо новий об'єкт для прикрас Discord
// Це спеціальний об'єкт, який не входить в основний products
// Він має структуру, схожу на звичайний сервіс, але з двома "планами" - це вкладки "Без Nitro" і "З Nitro"
const discordDecorProducts = {
  name: "Discord Прикраси", // Назва сервісу
  logo: "images/discord.webp", // Шлях до логотипу
  // Плани для прикрас - це вкладки "Без Nitro" і "З Nitro"
  plans: [
    {
      id: "discord_decor_without_nitro", // Унікальний ідентифікатор плану
      name: "Без Nitro", // Назва плану (вкладки)
      description: "Прикраси для користувачів без Nitro", // Опис плану
      // Опції для цього плану - це конкретні товари з ціною
      options: [
        // Кожен об'єкт в options - це один товар
        // period - номінал товару (відображається в картці)
        // price - ціна в гривнях (відображається в картці)
        { period: "6$", price: 180 },
        { period: "8$", price: 235 },
        { period: "10$", price: 295 },
        { period: "11$", price: 325 },
        { period: "12$", price: 355 },
        { period: "13$", price: 385 },
        { period: "15$", price: 440 },
        { period: "16$", price: 470 },
        { period: "18$", price: 530 },
        { period: "24$", price: 705 },
        { period: "29$", price: 855 }
      ]
    },
    {
      id: "discord_decor_with_nitro", // Унікальний ідентифікатор плану
      name: "З Nitro", // Назва плану (вкладки)
      description: "Прикраси для користувачів з Nitro", // Опис плану
      // Опції для цього плану - це конкретні товари з ціною
      options: [
        { period: "5$", price: 145 },
        { period: "7$", price: 205 },
        { period: "8.5$", price: 250 },
        { period: "9$", price: 265 },
        { period: "14$", price: 410 },
        { period: "22$", price: 650 }
      ]
    }
  ]
};

// --- НОВІ ТОВАРИ ---
const digitalProducts = {
  roblox: {
    name: "Roblox Gift Card",
    logo: "images/roblox.webp", // Переконайтесь, що файл існує
    plans: [
      {
        id: "roblox_gift_card",
        name: "Gift Card",
        description: "Поповніть свій акаунт Roblox.",
        options: [
          { period: "10$", price: 459 },
          { period: "25$", price: 1149 },
          { period: "50$", price: 2299 }
        ]
      }
    ]
  },
  psn_tru: {
    name: "PSN Gift Card (TRY)",
    logo: "images/psn.webp", // Переконайсь, що файл існує
    plans: [
      {
        id: "psn_gift_card_tru",
        name: "Gift Card (TRY)",
        description: "Gift card для акаунтів регіону Туреччина. <strong>ВАЖЛИВО:</strong> TRU (турецькі ліри) - валюта Туреччини. <br><br><strong style='font-size: 1.2em;'>Для активації цієї картки потрібно створити НОВИЙ акаунт PlayStation регіону Туреччина або змінити регіон існуючого акаунта.</strong> <br><a href='https://zmiana-regionu-psn-pnyv1ju.gamma.site/' target='_blank' style='color: var(--primary); font-weight: bold;'>Як змінити регіон акаунта PlayStation (Посилання на документацію)</a>", // Додано опис валюти та попередження
        options: [
          { period: "250 TRU", price: 349 },
          { period: "500 TRU", price: 699 },
          { period: "750 TRU", price: 1049 },
          { period: "1000 TRU", price: 1350 },
          { period: "1500 TRU", price: 2000 },
          { period: "2000 TRU", price: 2700 },
          { period: "2500 TRU", price: 3400 },
          { period: "3000 TRU", price: 4100 },
          { period: "4000 TRU", price: 5300 },
          { period: "5000 TRU", price: 6600 }
        ]
      }
    ]
  },
  psn_inr: {
    name: "PSN Gift Card (INR)",
    logo: "images/psn.webp", // Переконайсь, що файл існує
    plans: [
      {
        id: "psn_gift_card_inr",
        name: "Gift Card (INR)",
        description: "Gift card для акаунтів регіону Індія. <strong>ВАЖЛИВО:</strong> INR (індійські рупії) - валюта Індії. <br><br><strong style='font-size: 1.2em;'>Для активації цієї картки потрібно створити НОВИЙ акаунт PlayStation регіону Індія або змінити регіон існуючого акаунта.</strong> <br><a href='#' target='_blank' style='color: var(--primary); font-weight: bold;'>Як змінити регіон акаунта PlayStation (Посилання на документацію)</a>", // Додано опис валюти та попередження
        options: [
          { period: "1000 INR", price: 725 },
          { period: "2000 INR", price: 1400 },
          { period: "3000 INR", price: 2100 },
          { period: "4000 INR", price: 2750 },
          { period: "5000 INR", price: 3400 }
        ]
      }
    ]
  }
};
// --- КІНЕЦЬ НОВИХ ТОВАРІВ ---

// Основний об'єкт з усіма сервісами (підписками)
const products = {
  // Кожен ключ об'єкта - це ID сервісу (використовується в data-service)
  chatgpt: {
    name: "ChatGPT", // Назва сервісу
    logo: "images/chatgpt.webp", // Шлях до логотипу
    // Плани для сервісу - це різні типи підписок
    plans: [
      {
        id: "chatgpt_plus", // Унікальний ідентифікатор плану
        name: "Plus", // Назва плану
        description: "Доступ до GPT-4, розширені можливості", // Опис плану
        // Опції для цього плану - це періоди підписки з цінами
        options: [
          // Кожен об'єкт в options - це один період підписки
          // period - період підписки (відображається в картці)
          // price - ціна в гривнях (відображається в картці)
          { period: "1 місяць", price: 650 }
        ]
      }
    ]
  },
  discord: {
    name: "Discord",
    logo: "images/discord.webp",
    plans: [
      {
        id: "discord_basic",
        name: "Nitro Basic",
        description: "Базові можливості Nitro",
        options: [
          { period: "1 місяць", price: 100 },
          { period: "12 місяців", price: 900 }
        ]
      },
      {
        id: "discord_full",
        name: "Nitro Full",
        description: "Повна версія з усіма функціями",
        options: [
          { period: "1 місяць", price: 170 },
          { period: "12 місяців", price: 1700 }
        ]
      }
    ]
  },
  duolingo: {
    name: "Duolingo",
    logo: "images/duolingo.webp",
    plans: [
      {
        id: "duolingo_individual",
        name: "Individual",
        description: "Преміум для одного користувача",
        options: [
          { period: "1 місяць", price: 200 },
          { period: "12 місяців", price: 1500 }
        ]
      },
      {
        id: "duolingo_family",
        name: "Family",
        description: "Підписка на вас та ще 5 осіб",
        options: [
          { period: "12 місяців", price: 380 }
        ]
      }
    ]
  },
  picsart: {
    name: "PicsArt",
    logo: "images/picsart.webp",
    plans: [
      {
        id: "picsart_plus",
        name: "Plus",
        description: "Розширені інструменти",
        options: [
          { period: "1 місяць", price: 130 },
          { period: "12 місяців", price: 800 }
        ]
      },
      {
        id: "picsart_pro",
        name: "Pro",
        description: "Професійні можливості",
        options: [
          { period: "1 місяць", price: 180 },
          { period: "12 місяців", price: 1000 }
        ]
      }
    ]
  },
  canva: {
    name: "Canva",
    logo: "images/canva.webp",
    plans: [
      {
        id: "canva_individual",
        name: "Individual",
        description: "Преміум для одного користувача",
        options: [
          { period: "1 місяць", price: 350 },
          { period: "12 місяців", price: 3000 }
        ]
      },
      {
        id: "canva_family",
        name: "Family",
        description: "Підписка на вас та ще 3 осіб",
        options: [
          { period: "1 місяць", price: 850 },
          { period: "12 місяців", price: 7500 }
        ]
      }
    ]
  },
  netflix: {
    name: "Netflix",
    logo: "images/netflix.webp",
    plans: [
      {
        id: "netflix_premium",
        name: "Premium",
        description: "4K, 4 екрани, без реклами",
        options: [
          { period: "1 місяць", price: 350 }
        ]
      }
    ]
  }
  // Додавання нових цифрових товарів до основного об'єкта products
  // Це потрібно для того, щоб вони відображалися на сторінці цифрових товарів
  // як окремі сервіси. Ми розширюємо об'єкт products.
  // ...digitalProducts // Оператор spread не працює в цьому контексті для об'єктів
  // Тому додаємо кожен товар окремо:
};
// Додаємо нові цифрові товари до основного об'єкта products
Object.assign(products, digitalProducts);
