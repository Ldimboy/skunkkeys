import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Password } from '../models/password.model';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private apiUrl = 'http://localhost:8000/api/passwords';

  constructor(private http: HttpClient) {}

  getPassword(id: number): Observable<Password> {
    return this.http.get<{ password: Password }>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.password)
    );
  }

  getPasswords(): Observable<Password[]> {
    return this.http.get<{ passwords: Password[] }>(this.apiUrl).pipe(
      map(res => res.passwords)
    );
  }

  createPassword(password: Partial<Password>): Observable<Password> {
    return this.http.post<{ password: Password }>(this.apiUrl, password).pipe(
      map(res => res.password)
    );
  }

  updatePassword(id: number, password: Partial<Password>): Observable<Password> {
    return this.http.put<{ password: Password }>(`${this.apiUrl}/${id}`, password).pipe(
      map(res => res.password)
    );
  }

  deletePassword(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
