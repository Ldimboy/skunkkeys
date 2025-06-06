import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']

})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  password_confirmation: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation
    };

    this.authService.register(userData).subscribe({
      next: (res) => {
        this.successMessage = res.message;

        // Con esto tras resgistro se lleva a /verify
        setTimeout(() => {
          this.router.navigate(['/verify'], {
            queryParams: { email: this.email }
          });
        }, 2000);


      },
      error: (err) => {
        if (err.error && typeof err.error === 'object') {
          this.errorMessage = Object.values(err.error).join(' | ');
        } else {
          this.errorMessage = 'Error en el registro. Inténtalo de nuevo.';
        }
      }
    });
  }
}
