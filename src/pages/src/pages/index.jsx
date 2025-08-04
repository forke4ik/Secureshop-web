<style jsx>{`
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .categories {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }
  
  .categories button {
    padding: 8px 16px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .categories button.active {
    background: #3498db;
    color: white;
    border-color: #3498db;
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
    margin-bottom: 40px;
  }
  
  .product-card {
    border: 1px solid #eee;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    transition: transform 0.3s;
  }
  
  .product-card:hover {
    transform: translateY(-5px);
  }
  
  .image-placeholder {
    height: 160px;
    background: linear-gradient(135deg, #3498db, #8e44ad);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 24px;
  }
  
  .product-info {
    padding: 20px;
  }
  
  .product-info h3 {
    margin-top: 0;
    color: #2c3e50;
  }
  
  .product-meta {
    display: flex;
    justify-content: space-between;
    margin: 15px 0;
  }
  
  .price {
    font-weight: bold;
    font-size: 1.2em;
    color: #27ae60;
  }
  
  .period {
    background: #f0f0f0;
    padding: 3px 8px;
    border-radius: 5px;
    font-size: 0.9em;
  }
  
  .buy-button {
    display: block;
    text-align: center;
    background: #3498db;
    color: white;
    padding: 10px;
    border-radius: 5px;
    text-decoration: none;
    font-weight: bold;
    transition: background 0.3s;
  }
  
  .buy-button:hover {
    background: #2980b9;
  }
  
  footer {
    text-align: center;
    padding: 20px;
    border-top: 1px solid #eee;
    margin-top: 30px;
    color: #7f8c8d;
  }
`}</style>
