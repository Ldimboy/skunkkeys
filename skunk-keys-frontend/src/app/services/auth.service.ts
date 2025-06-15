import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { JwtPayload } from '../models/jwt-payload.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getUser(): any {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  verifyCode(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email`, data);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        const token = response.token;
        localStorage.setItem('token', token);

        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded) {
          localStorage.setItem('user', JSON.stringify(decoded));
        }
      })
    );
  }


  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = jwtDecode<JwtPayload>(token);
      console.log('🧩 Token decodificado:', payload); 
      return payload;
    } catch (err) {
      console.error('Error al decodificar el token', err);
      return null;
    }
  }


  // Forgot password
  resetPasswordRequest(data: { email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password-request`, data);
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }
}
