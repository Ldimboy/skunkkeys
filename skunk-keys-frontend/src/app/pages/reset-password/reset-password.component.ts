import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})

export class ResetPasswordComponent implements OnInit {
  email: string = '';
  code: string = '';
  password: string = '';
  password_confirmation: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  showPassword: boolean = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) { }



  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  resetPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const data = {
      email: this.email,
      code: this.code,
      new_password: this.password,
      new_password_confirmation: this.password_confirmation
    };

    this.authService.resetPassword(data).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al restablecer la contraseña.';
      }
    });
  }
}
