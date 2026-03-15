import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '../environments/environment';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.apiBaseUrl || !req.url.startsWith('/api')) {
    return next(req);
  }
  return next(req.clone({ url: environment.apiBaseUrl + req.url }));
};
