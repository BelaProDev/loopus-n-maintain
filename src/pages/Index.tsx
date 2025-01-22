import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { FileText, Wrench, Settings, MessageCircle, Image, BarChart3, FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { t } = useTranslation(['common', 'home']);

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: t('home:features.documents'),
      description: t('home:features.documentsDesc'),
      link: '/tools/documents',
      color: 'bg-blue-500/10 text-blue-500'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: t('home:features.analytics'),
      description: t('home:features.analyticsDesc'),
      link: '/tools/analytics',
      color: 'bg-green-500/10 text-green-500'
    },
    {
      icon: <FileSpreadsheet className="h-6 w-6" />,
      title: t('home:features.invoicing'),
      description: t('home:features.invoicingDesc'),
      link: '/tools/invoicing',
      color: 'bg-purple-500/10 text-purple-500'
    },
    {
      icon: <Image className="h-6 w-6" />,
      title: t('home:features.gallery'),
      description: t('home:features.galleryDesc'),
      link: '/tools/photo-gallery',
      color: 'bg-pink-500/10 text-pink-500'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter gradient-heading">
              {t('home:welcome')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home:description')}
            </p>
            <div className="pt-8">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/tools">
                  {t('common:nav.getStarted')}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16 md:py-24 bg-muted/50">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home:features.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Link to={feature.link} className="space-y-4">
                  <div className={`p-3 w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
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