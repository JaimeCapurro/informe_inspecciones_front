import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpHandler, HttpRequest } from '@angular/common/http';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ],
    });

    interceptor = TestBed.inject(AuthInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header', () => {
    const mockRequest = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>) => {
        expect(req.headers.has('Authorization')).toBeTrue();
        expect(req.headers.get('Authorization')).toBe('Bearer test-token');
        return null as any; 
      }),
    };

    spyOn(localStorage, 'getItem').and.returnValue('test-token');
    interceptor.intercept(mockRequest, next);
    expect(next.handle).toHaveBeenCalled();
  });
});
