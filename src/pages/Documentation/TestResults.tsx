import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Play, AlertCircle, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { runFeatureTests, generateTestReport } from '@/utils/testUtils';
import { useToast } from "@/components/ui/use-toast";

const TestResults = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      const testResults = await runFeatureTests();
      setResults(testResults);
      toast({
        title: "Tests completed",
        description: `${testResults.filter(r => r.status === 'passed').length} passed, ${testResults.filter(r => r.status === 'failed').length} failed`,
      });
    } catch (error) {
      toast({
        title: "Test execution failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'not-implemented':
        return <MinusCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Feature Tests</h2>
        <Button 
          onClick={handleRunTests} 
          disabled={isRunning}
        >
          <Play className="w-4 h-4 mr-2" />
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </Button>
      </div>

      {results.length > 0 && (
        <ScrollArea className="h-[500px] rounded-md border p-4">
          <div className="space-y-4">
            {results.map((result, index) => (
              <Alert key={index} variant={result.status === 'failed' ? 'destructive' : 'default'}>
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <h3 className="font-medium">{result.feature}</h3>
                    <AlertDescription>
                      Status: {result.status}
                      {result.error && (
                        <div className="text-sm text-red-500 mt-1">
                          Error: {result.error}
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};

export default TestResults;