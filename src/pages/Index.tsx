import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Wrench, FileText, BarChart3, FileSpreadsheet, Image, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { t } = useTranslation(['common', 'home']);

  const tools = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: t('tools:documents.title'),
      description: t('tools:documents.description'),
      to: '/tools/documents',
      color: 'bg-blue-500/10 text-blue-500'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: t('tools:analytics.title'),
      description: t('tools:analytics.description'),
      to: '/tools/analytics',
      color: 'bg-green-500/10 text-green-500'
    },
    {
      icon: <FileSpreadsheet className="h-6 w-6" />,
      title: t('tools:invoicing.title'),
      description: t('tools:invoicing.description'),
      to: '/tools/invoicing',
      color: 'bg-purple-500/10 text-purple-500'
    },
    {
      icon: <Image className="h-6 w-6" />,
      title: t('tools:photoGallery.title'),
      description: t('tools:photoGallery.description'),
      to: '/tools/photo-gallery',
      color: 'bg-pink-500/10 text-pink-500'
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: t('tools:chat.title'),
      description: t('tools:chat.description'),
      to: '/tools/chat',
      color: 'bg-yellow-500/10 text-yellow-500'
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      title: t('tools:business.title'),
      description: t('tools:business.description'),
      to: '/admin/business',
      color: 'bg-orange-500/10 text-orange-500'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              {t('home:welcome')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home:description')}
            </p>
            <div className="pt-8">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/tools">
                  {t('common:nav.tools')}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="container mx-auto px-4 py-16 md:py-24 bg-muted/50">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('home:features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <Card 
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Link to={tool.to} className="space-y-4">
                  <div className={`p-3 w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{tool.title}</h3>
                  <p className="text-muted-foreground">{tool.description}</p>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('home:cta.title')}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('home:cta.description')}
          </p>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link to="/contact">
              {t('common:nav.contact')}
            </Link>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;