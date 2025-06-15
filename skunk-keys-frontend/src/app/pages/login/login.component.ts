import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {

  // Campos del formulario
  username: string = '';
  password: string = '';
  showPassword: boolean = false;

  // Mensaje de error o advertencia
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Muestra mensajes personalizados si se llega al login con ?reason=...
    this.route.queryParams.subscribe(params => {
      const reason = params['reason'];

      if (reason === 'frozen') {
        this.errorMessage = 'Tu cuenta ha sido congelada. Contacta con el administrador.';
      } else if (reason === 'expired') {
        this.errorMessage = 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.';
      } else if (reason === 'denied') {
        this.errorMessage = 'Acceso denegado. No tienes permisos para entrar a esta sección.';
      }
    });
  }

  /**
   * Alterna la visibilidad de la contraseña.
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Envía el formulario de login.
   * Si la autenticación es correcta → redirige al dashboard.
   * Si falla → muestra mensaje de error.
   */
  login(): void {
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/all-items');
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al iniciar sesión';
      }
    });
  }
}