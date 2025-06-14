import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.username = user?.username || 'Usuario';
    this.isAdmin = user?.is_admin || false;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  goToProfile() {
    this.router.navigate(['/dashboard/profile']);
  }

  goToAdminPanel() {
    this.router.navigate(['/admin']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}