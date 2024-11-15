import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/settings', () => {
    return HttpResponse.json({
      whatsappNumbers: {
        electrical: '1234567890',
        plumbing: '1234567890',
        ironwork: '1234567890',
        woodwork: '1234567890',
        architecture: '1234567890'
      }
    });
  }),
];