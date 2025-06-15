import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Verifica si el usuario puede acceder a una ruta protegida.
   * Bloquea el acceso si:
   * - No hay token.
   * - El usuario no está definido o está congelado (is_active === false).
   */
  canActivate(): boolean {
    const token = this.authService.getToken();

    // No hay token → redirige al login
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const user = this.authService.getCurrentUser();

    // Usuario inválido o cuenta congelada → logout y redirección con motivo "frozen"
    if (!user || user.is_active === false) {
      this.authService.logout();
      this.router.navigate(['/login'], {
        queryParams: { reason: 'frozen' }
      });
      return false;
    }

    // Usuario válido → acceso permitido
    return true;
  }
}
