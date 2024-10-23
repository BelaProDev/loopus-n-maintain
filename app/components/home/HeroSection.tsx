import { Button } from "~/components/ui/button";
import texts from "~/data/website-texts.json";

interface HeroSectionProps {
  isAuthenticated: boolean;
  onSignIn: () => void;
}

export function HeroSection({ isAuthenticated, onSignIn }: HeroSectionProps) {
  return (
    <section 
      aria-labelledby="hero-title" 
      className="bg-[#2E5984]/90 backdrop-blur-sm text-white py-16"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 
            id="hero-title" 
            className="text-4xl md:text-5xl font-bold mb-4 font-['Playfair_Display']"
          >
            {texts.home.hero.title}
          </h1>
          <p className="text-xl mb-8">
            {texts.home.hero.subtitle}
          </p>
          {!isAuthenticated && (
            <Button 
              onClick={onSignIn}
              size="lg" 
              className="bg-white text-[#2E5984] hover:bg-gray-100"
              aria-label="Sign in to access all features"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}