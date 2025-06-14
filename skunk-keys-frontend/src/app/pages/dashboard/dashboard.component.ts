import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  username: string = '';

  ngOnInit(): void {
    this.username = 'Usuario autenticado';
  }

  getToken(): string {
    return localStorage.getItem('token') || 'No token';
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}