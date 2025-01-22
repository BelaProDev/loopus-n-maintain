import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { FileText, Tool, Settings, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { t } = useTranslation(['common', 'home']);

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: t('home:features.documents'),
      description: t('home:features.documentsDesc'),
      link: '/tools/documents'
    },
    {
      icon: <Tool className="h-6 w-6" />,
      title: t('home:features.tools'),
      description: t('home:features.toolsDesc'),
      link: '/tools'
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: t('home:features.admin'),
      description: t('home:features.adminDesc'),
      link: '/admin'
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: t('home:features.chat'),
      description: t('home:features.chatDesc'),
      link: '/tools/chat'
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
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <Link to={feature.link} className="space-y-4">
                  <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;