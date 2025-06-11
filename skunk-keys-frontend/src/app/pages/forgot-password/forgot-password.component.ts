import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})

export class ForgotPasswordComponent {
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  requestReset(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.resetPasswordRequest({ email: this.email }).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        setTimeout(() => {
          this.router.navigate(['/reset-password'], { queryParams: { email: this.email } });
        }, 2500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Ha ocurrido un error.';
      }
    });
  }
}