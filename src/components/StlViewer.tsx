import { Alert, AlertDescription } from "@/components/ui/alert";

export default function StlViewer() {
  return (
    <section aria-label="3D Model Visualization" className="h-[400px] relative my-16 bg-gray-50/50 flex items-center justify-center">
      <Alert>
        <AlertDescription>
          3D visualization is temporarily disabled for maintenance.
        </AlertDescription>
      </Alert>
    </section>
  );
}