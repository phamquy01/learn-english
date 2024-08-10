import http from '@/lib/http';
const apiATranslateRequests = {
  translate: () => http.get('/account/me'),
};

export default apiATranslateRequests;
