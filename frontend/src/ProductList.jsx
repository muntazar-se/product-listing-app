import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import './ProductList.css';
import Loading from './Loading';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get('https://product-listing-backend-v4t5.onrender.com/api/products');
        setProducts(res.data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [menuOpen]);

  useEffect(() => {
    function handleResize() {
      if (swiperRef.current && swiperRef.current.update) {
        swiperRef.current.update();
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleSort = (option) => {
    setSortOption(option);
    setMenuOpen(false);
    let sorted = [...products];
    if (option === 'price-high-low') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (option === 'price-low-high') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (option === 'popularity-high-low') {
      sorted.sort((a, b) => parseFloat(b.popularityOutOf5) - parseFloat(a.popularityOutOf5));
    } else if (option === 'popularity-low-high') {
      sorted.sort((a, b) => parseFloat(a.popularityOutOf5) - parseFloat(b.popularityOutOf5));
    }
    setProducts(sorted);
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="w-full flex flex-col items-center pt-10 px-2 animate-fade-in-up">
      <h1 className="product-list-title text-center my-8 font-light text-xl">Product List</h1>
      <div className="flex flex-row-reverse justify-end w-full max-w-5xl mb-4 pr-4 sm:pr-4 sm:mb-4 sm:max-w-5xl px-2 sm:px-0">
        <div className="relative inline-block w-full sm:w-auto lg:w-48">
          <button
            ref={menuButtonRef}
            className="flex items-center gap-2 w-full px-5 py-4 sm:px-5 sm:py-2 lg:px-0 lg:py-2 text-lg sm:text-sm lg:text-xs font-medium border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150 justify-center"
            onClick={handleMenuToggle}
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <span>Filter & Sort</span>
            <svg className={`w-5 h-5 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" aria-hidden="true"></div>
              <div
                ref={menuRef}
                className="absolute left-0 top-full mt-2 w-full lg:w-48 lg:left-auto lg:right-0 bg-white border border-gray-200 rounded-xl shadow-2xl z-20 animate-fade-in"
                style={{ minWidth: '0', maxWidth: '100vw' }}
                tabIndex="-1"
              >
                <div className="px-4 pt-4 pb-2 text-xs sm:text-xs lg:text-[11px] text-gray-500 font-semibold tracking-wide">Sort by Price</div>
                <button className="w-full text-left px-5 py-4 sm:py-2 lg:px-3 lg:py-2 text-lg sm:text-sm lg:text-xs rounded transition hover:bg-blue-50 focus:bg-blue-100" onClick={() => handleSort('price-high-low')}>High to Low</button>
                <button className="w-full text-left px-5 py-4 sm:py-2 lg:px-3 lg:py-2 text-lg sm:text-sm lg:text-xs rounded transition hover:bg-blue-50 focus:bg-blue-100" onClick={() => handleSort('price-low-high')}>Low to High</button>
                <div className="px-4 pt-4 pb-2 text-xs sm:text-xs lg:text-[11px] text-gray-500 font-semibold tracking-wide">Sort by Popularity</div>
                <button className="w-full text-left px-5 py-4 sm:py-2 lg:px-3 lg:py-2 text-lg sm:text-sm lg:text-xs rounded transition hover:bg-blue-50 focus:bg-blue-100" onClick={() => handleSort('popularity-high-low')}>High to Low</button>
                <button className="w-full text-left px-5 py-4 sm:py-2 lg:px-3 lg:py-2 text-lg sm:text-sm lg:text-xs rounded transition hover:bg-blue-50 focus:bg-blue-100" onClick={() => handleSort('popularity-low-high')}>Low to High</button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="relative w-full flex justify-center items-center" style={{ minHeight: '400px' }}>
        <button
          className="absolute left-6 z-10 w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition cursor-pointer"
          style={{ border: 'none', top: '50%', transform: 'translateY(-50%)' }}
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous"
        >
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 8L12 16L20 24" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-5xl">
          <Swiper
            modules={[Navigation, Scrollbar, A11y]}
            spaceBetween={16}
            slidesPerView={1}
            onSwiper={swiper => (swiperRef.current = swiper)}
            navigation={false}
            scrollbar={{ draggable: true }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 8 },
              480: { slidesPerView: 1, spaceBetween: 12 },
              640: { slidesPerView: 2, spaceBetween: 16 },
              900: { slidesPerView: 3, spaceBetween: 24 },
              1200: { slidesPerView: 4, spaceBetween: 50 },
            }}
            className="w-full custom-swiper-nav"
            style={{ padding: '2rem 0' }}
          >
            {products.map((product, idx) => (
              <SwiperSlide key={idx}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <button
          className="absolute right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition cursor-pointer"
          style={{ border: 'none', top: '50%', transform: 'translateY(-50%)' }}
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next"
        >
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
            <path d="M20 8L12 16L20 24" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ProductList; 