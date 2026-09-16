// products.js — Product data with live API loading from SecureShop backend
// Falls back to hardcoded data if API is unavailable.

const API_URL = 'https://secureshop-hzqd.onrender.com/api/public/products';

// ═══════════════ Fallback data (used if API is down) ═══════════════

const fallbackDiscordDecorProducts = {
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

const fallbackDiscordBoostsProducts = {
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

const fallbackProducts = {
  discord: {
    name: "Discord",
    logo: "images/discord.webp",
    warranty: "Весь термін підписки",
    plans: [
      { id: "discord_basic", name: "Nitro Basic", description: "Базові можливості Nitro", options: [{ period: "1 місяць", price: 120 }, { period: "12 місяців", price: 1200 }] },
      { id: "discord_full", name: "Nitro Full", description: "Повний доступ до всіх можливостей Nitro", options: [{ period: "1 місяць", price: 200 }, { period: "12 місяців", price: 2000 }] },
      { id: "discord_full_3m_special", name: "Nitro Full — 3 місяці (особливі умови)", description: "Увага! Якщо ви вибрали nitro full на ваш акаунт (промокодом), то він повинен бути старший 31 днів, і на ньому не було підписки останній рік", options: [{ period: "На ваш акаунт (промокод)", price: 200 }, { period: "Наш акаунт (готовий)", price: 250 }] }
    ]
  },
  canva: { name: "Canva", logo: "images/canva.webp", warranty: "Весь термін підписки", plans: [{ id: "canva_family", name: "Family", description: "Підписка на вас та ще 3 осіб", options: [{ period: "1 місяць", price: 250 }, { period: "12 місяців", price: 800 }] }] },
  netflix: { name: "Netflix", logo: "images/netflix.webp", warranty: "Весь термін підписки", plans: [{ id: "netflix_premium", name: "Premium", description: "4K, 4 екрани, без реклами", options: [{ period: "1 місяць", price: 200 }, { period: "3 місяці", price: 600 }, { period: "6 місяців", price: 1000 }, { period: "12 місяців", price: 1800 }] }] },
  gemini: { name: "Gemini", logo: "images/gemini.webp", warranty: "1 місяць", plans: [{ id: "gemini_pro", name: "Gemini AI Pro", description: "Підписка на Gemini AI Pro", options: [{ period: "1 рік(готовий акаунт)", price: 350 }, { period: "18 місяців(промокод на ваш акаунт)", price: 600 }] }] },
  youtube: { name: "YouTube Premium", logo: "images/youtube.svg", warranty: "3 місяці", plans: [{ id: "youtube_premium", name: "Premium", description: "YouTube Premium (Гарантія 3 місяці на всі плани)", options: [{ period: "3 місяці (ваш акаунт, гіфт)", price: 650 }, { period: "12 місяців (ваш акаунт, гіфт)", price: 2300 }] }] },
  duolingo: { name: "Duolingo", logo: "images/duolingo.webp", warranty: "3 місяці", plans: [{ id: "duolingo_family", name: "Family", description: "Сімейний план Duolingo", options: [{ period: "12 місяців", price: 400 }] }] },
  adobe: { name: "Adobe", logo: "images/adobe.webp", warranty: "1 місяць", plans: [{ id: "adobe_cc", name: "Creative Cloud", description: "Повний пакет Adobe Creative Cloud", options: [{ period: "1 місяць", price: 400 }] }] },
  psn: { name: "PSN Gift Card", logo: "images/psn.webp", plans: [{ id: "psn_gift_cards", name: "Gift Cards", description: "Поповнення рахунку PlayStation Network", options: [{ period: "1000INR", price: 725 }, { period: "2000INR", price: 1400 }, { period: "3000INR", price: 2100 }, { period: "4000INR", price: 2750 }, { period: "5000INR", price: 3400 }] }] }
};

// ═══════════════ Active variables (overwritten by API) ═══════════════

let discordDecorProducts = fallbackDiscordDecorProducts;
let discordBoostsProducts = fallbackDiscordBoostsProducts;
let products = { ...fallbackProducts };

// ═══════════════ Logo mapping ═══════════════

const logoMap = {
  discord: "images/discord.webp",
  canva: "images/canva.webp",
  netflix: "images/netflix.webp",
  gemini: "images/gemini.webp",
  youtube: "images/youtube.svg",
  duolingo: "images/duolingo.webp",
  adobe: "images/adobe.webp",
  psn: "images/psn.webp",
  chatgpt: "images/chatgpt.webp",
  claude: "images/claude.webp",
  capcut: "images/capcut.webp",
  picsart: "images/picsart.webp",
};

function guessLogo(key, name) {
  if (logoMap[key]) return logoMap[key];
  const lower = (key + ' ' + name).toLowerCase();
  for (const [k, v] of Object.entries(logoMap)) {
    if (lower.includes(k)) return v;
  }
  return "images/discord.webp"; // generic fallback
}

// ═══════════════ API loader ═══════════════

async function loadProductsFromAPI() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const subs = data.subscriptions || [];
    const digital = data.digital_products || [];

    // Build subscriptions (products object)
    const newProducts = {};
    for (const sub of subs) {
      const plans = (sub.plans || []).map(p => {
        const plan = {
          id: `${sub.key}_${p.key}`,
          name: p.name,
          description: p.description || '',
          warranty: p.warranty || '',
          options: (p.options || []).map(o => ({ period: o.period, price: o.price, warranty: o.warranty || '' })),
        };
        // Extended options → separate plans with flat options
        if (p.extended_options && p.extended_options.length > 0) {
          // Group by period_group
          const groups = {};
          for (const eo of p.extended_options) {
            if (!groups[eo.period_group]) groups[eo.period_group] = [];
            groups[eo.period_group].push({ period: eo.name, price: eo.price, warranty: '' });
          }
          // Add extended as extra plan entries
          for (const [group, opts] of Object.entries(groups)) {
            plan.options.push(...opts);
          }
        }
        return plan;
      });

      newProducts[sub.key] = {
        name: sub.name,
        logo: guessLogo(sub.key, sub.name),
        warranty: sub.warranty || undefined,
        plans: plans,
      };
    }

    // Build digital products (discordDecor, discordBoosts, PSN)
    const bznItems = digital.filter(d => d.category === 'bzn');
    const znItems = digital.filter(d => d.category === 'zn');
    const boostItems = digital.filter(d => d.category === 'boost');
    const psnItems = digital.filter(d => d.category === 'psn');

    if (bznItems.length || znItems.length) {
      discordDecorProducts = {
        name: "Discord Прикраси",
        logo: "images/discord.webp",
        plans: [
          ...(bznItems.length ? [{
            id: "discord_decor_without_nitro",
            name: "Без Nitro",
            description: "Прикраси для користувачів без Nitro",
            options: bznItems.map(d => ({ period: d.name.replace(/.*?-\s*/, ''), price: d.price }))
          }] : []),
          ...(znItems.length ? [{
            id: "discord_decor_with_nitro",
            name: "З Nitro",
            description: "Прикраси для користувачів з Nitro",
            options: znItems.map(d => ({ period: d.name.replace(/.*?-\s*/, ''), price: d.price }))
          }] : []),
        ]
      };
    }

    if (boostItems.length) {
      discordBoostsProducts = {
        name: "Discord Boosts",
        logo: "images/discord.webp",
        plans: [{
          id: "discord_boosts_pack",
          name: "Boost пакети",
          description: "Boost'и для підвищення рівня вашого сервера",
          options: boostItems.map(d => ({ period: d.name.replace(/.*?-\s*/, ''), price: d.price }))
        }]
      };
    }

    // PSN as subscription-like entry (overwrite if exists)
    if (psnItems.length) {
      newProducts['psn'] = {
        name: "PSN Gift Card",
        logo: "images/psn.webp",
        plans: [{
          id: "psn_gift_cards",
          name: "Gift Cards",
          description: "Поповнення рахунку PlayStation Network",
          options: psnItems.map(d => ({ period: d.name.replace(/.*?-\s*/, ''), price: d.price }))
        }]
      };
    }

    // Only overwrite if we got data
    if (Object.keys(newProducts).length > 0) {
      products = newProducts;
    }

    console.log('✅ Products loaded from API:', Object.keys(products).length, 'subscriptions,', digital.length, 'digital');
  } catch (err) {
    console.warn('⚠️ Could not load products from API, using fallback data:', err.message);
  }
}
// loadProductsFromAPI() is called from app.js after DOM init
