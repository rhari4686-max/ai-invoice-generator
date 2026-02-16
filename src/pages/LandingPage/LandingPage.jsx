import React from 'react';
import Header from '../../components/landing/Header';
import Hero from '../../components/landing/Hero';
import Features from '../../components/landing/Features';
import Testimonials from '../../components/landing/Testimonials';
import FAQ from '../../components/landing/FAQ';
import Footer from '../../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
};

export default LandingPage;
