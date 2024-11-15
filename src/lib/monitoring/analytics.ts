import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

const vitalsCallback = (metric: any) => {
  // Analytics callback
  const body = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
  };

  // Send to your analytics service
  if (import.meta.env.PROD) {
    console.log('Performance metric:', body);
    // TODO: Replace with actual analytics service call
  }
};

export const initVitals = () => {
  getCLS(vitalsCallback);
  getFID(vitalsCallback);
  getLCP(vitalsCallback);
  getFCP(vitalsCallback);
  getTTFB(vitalsCallback);
};