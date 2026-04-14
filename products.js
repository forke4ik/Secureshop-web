const discordDecorProducts = {
  name: "Discord Прикраси",
  logo: "images/discord.webp",
  plans: [
    {
      id: "discord_decor_without_nitro",
      name: "Без Nitro",
      description: "Прикраси для користувачів без Nitro",
      options: [
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
      id: "discord_decor_with_nitro",
      name: "З Nitro",
      description: "Прикраси для користувачів з Nitro",
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

const discordBoostsProducts = {
  name: "Discord Boosts",
  logo: "images/discord.webp",
  plans: [
    {
      id: "discord_boosts_pack",
      name: "Boost пакети",
      description: "Boost'и для підвищення рівня вашого сервера",
      options: [
        { period: "2 шт", price: 80 },
        { period: "4 шт", price: 160 },
        { period: "6 шт", price: 240 },
        { period: "8 шт", price: 320 },
        { period: "10 шт", price: 400 },
        { period: "12 шт", price: 480 },
        { period: "14 шт", price: 560 }
      ]
    }
  ]
};

const products = {
  chatgpt: {
    name: "ChatGPT",
    logo: "images/chatgpt.webp",
    plans: [
      {
        id: "chatgpt_plus",
        name: "Plus",
        description: "Plus план",
        options: [
          { period: "1 місяць (ваш акаунт)", price: 400 },
          { period: "12 місяців (ваш акаунт)", price: 2500 },
        ]
      },
      {
        id: "chatgpt_go",
        name: "GO",
        description: "GO план на 1 рік",
        options: [
          { period: "1 рік (ваш акаунт)", price: 500 }
        ]
      },
      {
        id: "chatgpt_pro",
        name: "Pro",
        description: "Pro план",
        options: [
          { period: "1 місяць (ваш акаунт)", price: 6500 }
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
          { period: "1 місяць", price: 120 },
          { period: "12 місяців", price: 1200 }
        ]
      },
      {
        id: "discord_full",
        name: "Nitro Full",
        description: "Повний доступ до всіх можливостей Nitro",
        options: [
          { period: "1 місяць", price: 200 },
          { period: "12 місяців", price: 2000 }
        ]
      },
      {
        id: "discord_full_3m_special",
        name: "Nitro Full — 3 місяці (особливі умови)",
        description: "Увага! Якщо ви вибрали nitro full на ваш акаунт (промокодом), то він повинен бути старший 31 днів, і на ньому не було підписки останній рік",
        options: [
          { period: "На ваш акаунт (промокод)", price: 200 },
          { period: "Наш акаунт (готовий)", price: 250 }
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
  },
  gemini: {
    name: "Gemini",
    logo: "images/gemini.webp",
    plans: [
      {
        id: "gemini_pro",
        name: "Gemini AI Pro",
        description: "Підписка на Gemini AI Pro",
        options: [
          { period: "1 рік(готовий акаунт)", price: 350 }
        ]
      }
      // {
      //   id: "gemini_ultra",
      //   name: "AI Ultra",
      //   description: "Підписка на Gemini AI Ultra",
      //   options: [
      //     { period: "1 місяць", price: 500 }
      //   ]
      // }
    ]
  },
  duolingo: {
    name: "Duolingo",
    logo: "images/duolingo.webp",
    plans: [
      {
        id: "duolingo_family",
        name: "Family",
        description: "Сімейний план Duolingo",
        options: [
          { period: "12 місяців", price: 400 }
        ]
      }
    ]
  },
  capcut: {
    name: "CapCut",
    logo: "images/capcut.webp", 
    plans: [
      {
        id: "capcut_teams",
        name: "Teams",
        description: "Teams план для CapCut",
        options: [
          { period: "6 місяців", price: 700 }
        ]
      }
    ]
  },
  adobe: {
    name: "Adobe",
    logo: "images/adobe.webp", 
    plans: [
      {
        id: "adobe_cc",
        name: "Creative Cloud",
        description: "Повний пакет Adobe Creative Cloud",
        options: [
          { period: "4 місяці", price: 400 }
        ]
      }
    ]
  },
  psn: {
    name: "PSN Gift Card",
    logo: "images/psn.webp",
    plans: [
      {
        id: "psn_gift_cards",
        name: "Gift Cards",
        description: "Поповнення рахунку PlayStation Network",
        options: [
          { period: "1000INR", price: 725 },
          { period: "2000INR", price: 1400 },
          { period: "3000INR", price: 2100 },
          { period: "4000INR", price: 2750 },
          { period: "5000INR", price: 3400 }
        ]
      }
    ]
  }
};
