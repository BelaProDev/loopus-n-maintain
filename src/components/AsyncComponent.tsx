import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

interface AsyncComponentProps {
  children: React.ReactNode;
}

const AsyncComponent = ({ children }: AsyncComponentProps) => {
  return (
    <Suspense 
      fallback={
        <div className="flex justify-center items-center p-4">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default AsyncComponent;