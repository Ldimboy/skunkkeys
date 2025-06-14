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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToPasswordReset(): void {
    this.router.navigate(['/forgot-password']);
  }


  goToAdminPanel(): void {
    this.router.navigate(['/dashboard/admin']);
  }
}
