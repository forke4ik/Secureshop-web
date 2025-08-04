import Link from 'next/link';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        {/* Заглушка для изображения */}
        <div className="image-placeholder">{product.category}</div>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-meta">
          <span className="price">{product.price} UAH</span>
          <span className="period">{product.period}</span>
        </div>
        <Link href={`/product/${product.id}`} className="buy-button">
          Выбрать
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
