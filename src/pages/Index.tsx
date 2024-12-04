import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-6">Welcome</h1>
        <p className="text-muted-foreground">
          Select a tool from the header to get started.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Index;