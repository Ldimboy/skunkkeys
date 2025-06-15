import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { debounceTime, Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: false,
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})

export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  searchText: string = '';
  currentPage = 1;
  lastPage = 1;
  searchSubject = new Subject<string>();
  currentUserId: number = 0;

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = Number(currentUser?.sub); // el ID del usuario actual

    this.loadUsers();

    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.currentPage = 1;
      this.loadUsers();
    });
  }

  loadUsers(): void {
    this.adminService.getUsers(this.currentPage, this.searchText).subscribe(res => {
      this.users = res.data;
      this.currentPage = res.current_page;
      this.lastPage = res.last_page;
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchText);
  }

  toggleRole(userId: number): void {
    this.adminService.toggleRole(userId).subscribe(() => {
      this.loadUsers();
    });
  }

  toggleActive(userId: number): void {
    this.adminService.toggleActive(userId).subscribe(() => {
      this.loadUsers();
    });
  }

  resetPassword(userId: number): void {
    const newPassword = prompt('Introduce nueva contraseña (mínimo 8 caracteres, una mayúscula, un número y un símbolo):');

    if (!newPassword) return;

    this.adminService.resetPassword(userId, newPassword).subscribe({
      next: () => alert('Contraseña reseteada correctamente.'),
      error: err => alert(err?.error?.message || 'Error al resetear contraseña')
    });
  }

  deleteUser(userId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.adminService.deleteUser(userId).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.lastPage) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }
}