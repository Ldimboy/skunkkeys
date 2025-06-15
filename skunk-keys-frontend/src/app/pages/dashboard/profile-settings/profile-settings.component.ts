import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-settings',
  standalone: false,
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css'
})

export class ProfileSettingsComponent implements OnInit {
  user: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Obtiene los datos del usuario actual desde el AuthService
    this.user = this.authService.getCurrentUser();
  }

  // Cierra sesión y redirige al login
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Redirige a la página de restablecer contraseña
  goToPasswordReset(): void {
    this.router.navigate(['/forgot-password']);
  }
}
