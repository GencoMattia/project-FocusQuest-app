import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isAuthenticated = signal<boolean>(!!localStorage.getItem('token'));

  setToken(token: string | null) {
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
    this.isAuthenticated.set(!!token);
  }

  logout() { this.setToken(null); }
}
