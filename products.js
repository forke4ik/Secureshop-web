// products.js

// Додамо новий об'єкт для украшень Discord
// Це спеціальний об'єкт, який не входить в основний products
// Він має структуру, схожу на звичайний сервіс, але з двома "планами" - це вкладки "Без Nitro" і "З Nitro"
const discordDecorProducts = {
  name: "Discord Украшення", // Назва сервісу
  logo: "images/discord.webp", // Шлях до логотипу
  // Плани для украшень - це вкладки "Без Nitro" і "З Nitro"
  plans: [
    {
      id: "discord_decor_without_nitro", // Унікальний ідентифікатор плану
      name: "Без Nitro", // Назва плану (вкладки)
      description: "Украшення для користувачів без Nitro", // Опис плану
      // Опції для цього плану - це конкретні товари з ціною
      options: [
        // Кожен об'єкт в options - це один товар
        // period - номінал товару (відображається в картці)
        // price - ціна в гривнях (відображається в картці)
        { period: "6€", price: 180 },
        { period: "8€", price: 235 },
        { period: "10€", price: 295 },
        { period: "11€", price: 325 },
        { period: "12€", price: 355 },
        { period: "13€", price: 385 },
        { period: "15€", price: 440 },
        { period: "16€", price: 470 },
        { period: "18€", price: 530 },
        { period: "24€", price: 705 },
        { period: "29€", price: 855 }
      ]
    },
    {
      id: "discord_decor_with_nitro", // Унікальний ідентифікатор плану
      name: "З Nitro", // Назва плану (вкладки)
      description: "Украшення для користувачів з Nitro", // Опис плану
      // Опції для цього плану - це конкретні товари з ціною
      options: [
        { period: "5€", price: 145 },
        { period: "7€", price: 205 },
        { period: "8.5€", price: 250 },
        { period: "9€", price: 265 },
        { period: "14€", price: 410 },
        { period: "22€", price: 650 }
      ]
    }
  ]
};

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
};
