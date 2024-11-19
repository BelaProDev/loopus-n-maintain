import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Key, Link } from "lucide-react";

interface AuthMethodSelectorProps {
  onSelectMethod: (method: 'callback' | 'offline') => void;
}

const AuthMethodSelector = ({ onSelectMethod }: AuthMethodSelectorProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto p-4">
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelectMethod('callback')}>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <Link className="h-8 w-8 text-blue-500" />
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">Callback URL</h3>
          <p className="text-sm text-muted-foreground">
            Connect using OAuth redirect flow. Best for client-side applications.
          </p>
          <Button variant="outline" className="w-full" onClick={() => onSelectMethod('callback')}>
            Use Callback Method
          </Button>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelectMethod('offline')}>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <Key className="h-8 w-8 text-green-500" />
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">Offline Access</h3>
          <p className="text-sm text-muted-foreground">
            Connect using secure server-side tokens. Better for long-term access.
          </p>
          <Button variant="outline" className="w-full" onClick={() => onSelectMethod('offline')}>
            Use Offline Access
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AuthMethodSelector;