import { useEffect } from "react";
import { registerServiceWorker } from "~/lib/serviceWorker";

export function ServiceWorkerInit() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}