import type { NextPage } from 'next';

import Hero from '../components/Hero';
import Widget from '../components/Widget';
import ProductsSection from '../components/Products';
import About from '../components/About';

import PerfumeBrandsCarousel from '../components/Brands';

const Home: NextPage = () => {
  return (
    <div>
     
      <Hero />
      <PerfumeBrandsCarousel />
      <Widget />
      <ProductsSection />
      <About />
    
    </div>
  );
};

export default Home;
