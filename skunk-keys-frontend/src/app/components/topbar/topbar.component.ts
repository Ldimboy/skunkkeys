import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-topbar',
  standalone: false,
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})

export class TopbarComponent implements OnInit {
  dropdownOpen = false;
  username = '';
  isAdmin = false;
  isInAdminMode = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener el usuario actual
    const user = this.authService.getCurrentUser();
    this.username = user?.username || 'Usuario';
    this.isAdmin = user?.is_admin || false;

    // Verificar si está en modo admin tras navegación
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isInAdminMode = event.urlAfterRedirects.startsWith('/admin');
      });

    // Verificación inicial al cargar
    const currentUrl = this.router.url;
    this.isInAdminMode = currentUrl.startsWith('/admin');
  }

  // Mostrar/ocultar el menú desplegable
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Ir al perfil
  goToProfile(): void {
    this.router.navigate(['/dashboard/profile']);
  }

  // Entrar o salir del modo administrador
  goToAdminPanel(): void {
    if (this.isInAdminMode) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/admin']);
    }
  }

  // Cerrar sesión
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}