import { useState } from 'react';

const colorOptions = [
  { key: 'yellow', label: 'Yellow Gold', color: '#E6CA97' },
  { key: 'white', label: 'White Gold', color: '#D9D9D9' },
  { key: 'rose', label: 'Rose Gold', color: '#E1A4A9' },
];

function StarRating({ value }) {
  const fullStars = Math.floor(value);
  const halfStar = value - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <span style={{ color: '#FFC107', fontSize: 18 }}>
      {'★'.repeat(fullStars)}
      {halfStar ? '☆' : ''}
      {'☆'.repeat(emptyStars)}
    </span>
  );
}

function ProductCard({ product }) {
  const [selectedColor, setSelectedColor] = useState('yellow');
  return (
    <div
      className="rounded-[18px] p-5 w-full max-w-[90vw] md:max-w-md lg:max-w-xs text-left flex flex-col items-start mx-auto"
    >
      <div className="w-full h-[180px] bg-gray-50 rounded-[12px] mb-4 flex items-center justify-center overflow-hidden">
        <img src={product.images[selectedColor]} alt={product.name} className="w-full h-full object-contain" />
      </div>
      <div className="product-title mb-1 text-left text-lg font-light text-black">{product.name}</div>
      <div className="product-price mb-2 text-left text-base font-light text-black">${product.price} USD</div>
      <div className="flex gap-1 my-2">
        {colorOptions.map(opt => (
          <button
            key={opt.key}
            onClick={() => setSelectedColor(opt.key)}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform relative bg-white ${selectedColor === opt.key ? 'border border-black border-[0.5px]' : ''} cursor-pointer`}
            style={{ outline: 'none', margin: 0, padding: 0 }}
            aria-label={opt.label}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.12)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span style={{
              display: 'block',
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: opt.color,
            }} />
          </button>
        ))}
      </div>
      <div className="product-color-name mb-1 text-left text-sm font-light text-black">{colorOptions.find(c => c.key === selectedColor).label}</div>
      <div className="flex items-center gap-2 text-left text-sm font-light">
        <span className="product-rating"><StarRating value={parseFloat(product.popularityOutOf5)} /></span>
        <span className="product-rating text-gray-800">{product.popularityOutOf5}/5</span>
      </div>
    </div>
  );
}

export default ProductCard; 