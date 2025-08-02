import type { NextPage } from 'next';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Widget from '../components/Widget';
import ProductsSection from '@/components/Products';
import About from '@/components/About';
import Footer from '@/components/Footer';
import PerfumeBrandsCarousel from '@/components/Brands';

const Home: NextPage = () => {
  return (
    <div>
      <Nav />
      <Hero />
      <PerfumeBrandsCarousel />
      <Widget />
      <ProductsSection />
      <About />
      <Footer />
    </div>
  );
};

export default Home;
