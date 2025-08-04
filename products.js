const products = {
  chatgpt: {
    name: "ChatGPT",
    logo: "images/chatgpt.webp",
    plans: [
      {
        id: "chatgpt_plus",
        name: "Plus",
        description: "Доступ до GPT-4, розширені можливості",
        options: [
          { period: "1 місяць", price: 650 },
          { period: "3 місяці", price: 1800 },
          { period: "12 місяців", price: 6500 }
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
        description: "Для всієї родини (до 5 осіб)",
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
  }
};

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(item) {
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Загрузка корзины при старте
if (localStorage.getItem('cart')) {
  cart = JSON.parse(localStorage.getItem('cart'));
}
