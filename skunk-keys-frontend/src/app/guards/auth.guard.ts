import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const user = this.authService.getCurrentUser();

    // Usuario inválido o congelado y reenviados al login con "Frozen" Para mensaje definido
    if (!user || user.is_active === false) {
      this.authService.logout();
      this.router.navigate(['/login'], {
        queryParams: { reason: 'frozen' }
      });
      return false;
    }

    return true;
  }
}
