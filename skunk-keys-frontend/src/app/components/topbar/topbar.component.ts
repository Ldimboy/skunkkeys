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

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.username = user?.username || 'Usuario';
    this.isAdmin = user?.is_admin || false;

    // Escuchar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isInAdminMode = event.urlAfterRedirects.startsWith('/admin');
      });

    const currentUrl = this.router.url;
    this.isInAdminMode = currentUrl.startsWith('/admin');
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  goToProfile() {
    this.router.navigate(['/dashboard/profile']);
  }

  goToAdminPanel() {
    if (this.isInAdminMode) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/admin']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
