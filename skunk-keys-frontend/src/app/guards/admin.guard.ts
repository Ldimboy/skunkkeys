import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Verifica si el usuario autenticado tiene permisos de administrador.
   * Redirige al dashboard si no es administrador.
   */
  canActivate(): boolean {
    const user = this.authService.getCurrentUser();

    // Si es admin → acceso permitido
    if (user?.is_admin) {
      return true;
    }

    // Si no lo es → redirige al dashboard
    this.router.navigate(['/dashboard']);
    return false;
  }
}
