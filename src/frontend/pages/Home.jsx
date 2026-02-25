import { Categories, FeaturedProducts, Hero, NewestProduct } from '../components';
import { useAllProductsContext } from '../contexts/ProductsContextProvider';

const Home = () => {
  const { products: productsFromContext } = useAllProductsContext();

  if (productsFromContext.length < 1) {
    return <main className='full-page'></main>;
  }

  const newestProduct = productsFromContext[productsFromContext.length - 1];

  return (
    <main>
      <Hero />
      <NewestProduct product={newestProduct} />
      <Categories />
      <FeaturedProducts />
    </main>
  );
};

export default Home;
