import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-white">
      <Navbar />
      <main className="pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
