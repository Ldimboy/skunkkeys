import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = 'http://localhost:8000/api/admin/users';

  constructor(private http: HttpClient) {}

  // Obtener usuarios con paginación y búsqueda
  getUsers(page = 1, search = ''): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
    if (search.trim()) params = params.set('search', search);
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Cambiar rol (admin ↔ usuario)
  toggleRole(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/toggle-role`, {});
  }

  // Activar o congelar usuario
  toggleActive(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/toggle-active`, {});
  }

  // Resetear contraseña
  resetPassword(id: number, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/reset-password`, {
      new_password: newPassword,
      new_password_confirmation: newPassword
    });
  }

  // Eliminar usuario
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
