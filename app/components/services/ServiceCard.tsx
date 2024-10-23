import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Service } from "~/lib/services";

interface ServiceCardProps {
  service: Service;
  onLearnMore: () => void;
}

export function ServiceCard({ service, onLearnMore }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow backdrop-blur-sm bg-white/80">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Icon className="h-8 w-8 text-[#2E5984]" aria-hidden="true" />
          <CardTitle className="font-['Playfair_Display']">{service.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <Button 
          onClick={onLearnMore}
          variant="outline" 
          className="w-full"
          aria-label={`Learn more about ${service.title}`}
        >
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
}