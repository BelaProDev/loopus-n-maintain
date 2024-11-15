import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error);
    console.error('Error info:', errorInfo);
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
          <div className="text-destructive mb-4">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          <Button onClick={this.handleRefresh} variant="default">
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;