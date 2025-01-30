import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error);
    console.error('Error info:', errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
          <div className="text-destructive mb-4">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Oops! Something went wrong
          </h2>
          <p className="mb-6 max-w-md text-center text-muted-foreground">
            We're sorry for the inconvenience. Please try refreshing the page or going back to the home page.
          </p>
          {this.state.error && (
            <pre className="mb-6 max-w-md overflow-auto rounded bg-muted p-4 text-sm">
              {this.state.error.toString()}
            </pre>
          )}
          <div className="flex gap-4">
            <Button onClick={this.handleRefresh} variant="default">
              Refresh Page
            </Button>
            <Button onClick={this.handleGoHome} variant="outline">
              Go to Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}