import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Intercepta todas las peticiones HTTP salientes:
   * - Añade el token JWT si existe.
   * - Gestiona errores de autenticación y autorización.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    // Si existe un token, se añade al header Authorization
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        const msg = err.error?.message?.toLowerCase();

        // Error 403: Cuenta congelada
        if (err.status === 403) {
          if (msg?.includes('congelada')) {
            this.authService.logout();
            this.router.navigate(['/login'], {
              queryParams: { reason: 'frozen' }
            });
          }

          // Error 403: Permiso denegado (no es admin)
          else if (msg?.includes('permisos')) {
            this.authService.logout();
            this.router.navigate(['/login'], {
              queryParams: { reason: 'denied' }
            });
          }
        }

        // Error 401: Token expirado o inválido
        else if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login'], {
            queryParams: { reason: 'expired' }
          });
        }

        return throwError(() => err);
      })
    );
  }
}
