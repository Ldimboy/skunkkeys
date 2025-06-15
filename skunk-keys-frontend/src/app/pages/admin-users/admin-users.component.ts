import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { debounceTime, Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

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
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Obtener usuario actual
    const currentUser = this.authService.getCurrentUser();

    // Si no es admin, lo echamos
    if (!currentUser?.is_admin) {
      this.authService.logout();
      this.router.navigate(['/login'], {
        queryParams: { reason: 'denied' }
      });
      return;
    }

    // Guardar ID del usuario actual
    this.currentUserId = Number(currentUser?.sub);

    // Cargar usuarios al iniciar
    this.loadUsers();

    // Activar búsqueda reactiva con debounce
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.currentPage = 1;
      this.loadUsers();
    });
  }


  // Carga los usuarios del backend con filtros de búsqueda y paginación
  loadUsers(): void {
    this.adminService.getUsers(this.currentPage, this.searchText).subscribe(res => {
      this.users = res.data;
      this.currentPage = res.current_page;
      this.lastPage = res.last_page;
    });
  }

  // Ejecuta la búsqueda tras un cambio en el input
  onSearchChange(): void {
    this.searchSubject.next(this.searchText);
  }

  // Cambia el rol (admin ↔ usuario) del usuario indicado
  toggleRole(userId: number): void {
    this.adminService.toggleRole(userId).subscribe(() => {
      this.loadUsers();
    });
  }

  // Activa o congela la cuenta del usuario
  toggleActive(userId: number): void {
    this.adminService.toggleActive(userId).subscribe(() => {
      this.loadUsers();
    });
  }

  // Resetea la contraseña de un usuario mediante prompt
  resetPassword(userId: number): void {
    const newPassword = prompt('Introduce nueva contraseña (mínimo 8 caracteres, una mayúscula, un número y un símbolo):');
    if (!newPassword) return;

    this.adminService.resetPassword(userId, newPassword).subscribe({
      next: () => alert('Contraseña reseteada correctamente.'),
      error: err => alert(err?.error?.message || 'Error al resetear contraseña')
    });
  }

  // Elimina un usuario tras confirmación
  deleteUser(userId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.adminService.deleteUser(userId).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  // Navega a la siguiente página de usuarios
  nextPage(): void {
    if (this.currentPage < this.lastPage) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  // Navega a la página anterior
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }
}