import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent {
  // Estado para contraer o expandir la barra lateral
  isCollapsed = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // Alternar entre sidebar colapsado y expandido
  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  // Cerrar sesión y redirigir al login
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
