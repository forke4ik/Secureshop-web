import ProductCard from '@/components/ProductCard';
import products from '@/data/products';

export default function Home() {
  return (
    <div className="container">
      <header>
        <h1>SecureShop</h1>
        <p>Покупка подписок на премиум сервисы</p>
      </header>
      
      <div className="categories">
        <button className="active">Все товары</button>
        <button>ChatGPT</button>
        <button>Discord</button>
        <button>Duolingo</button>
        <button>PicsArt</button>
      </div>
      
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <footer>
        <p>При поддержке Telegram-бота: @SecureShopBot</p>
      </footer>
    </div>
  );
}
