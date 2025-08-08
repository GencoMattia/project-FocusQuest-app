import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../shared/toast/toast.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule, NgIf],
  template: `
    <div class="max-w-sm mx-auto">
      <h2 class="text-2xl font-semibold mb-4">Welcome Back</h2>
      <p class="text-slate-600 mb-4">Please sign in to continue</p>
      <form class="space-y-3" (ngSubmit)="logInUser()" novalidate>
        <div>
          <label class="block text-sm mb-1">Email address</label>
          <input [(ngModel)]="userEmail" name="email" type="email" class="w-full border rounded px-3 py-2" placeholder="Enter your email" required (input)="validateNativeEmail($event)" />
          <div class="text-rose-600 text-sm" *ngIf="errors.email">{{ errors.email }}</div>
        </div>
        <div>
          <label class="block text-sm mb-1">Password</label>
          <input [(ngModel)]="userPassword" name="password" type="password" class="w-full border rounded px-3 py-2" placeholder="Enter your password" required />
          <div class="text-rose-600 text-sm" *ngIf="errors.password">{{ errors.password }}</div>
        </div>
        <div class="text-rose-600 text-sm" *ngIf="errors.server">{{ errors.server }}</div>
        <button type="submit" class="w-full bg-blue-600 text-white rounded px-3 py-2">Sign In</button>
      </form>
    </div>
  `,
})
export class LoginPage {
  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private auth = inject(AuthService);

  userEmail = '';
  userPassword = '';
  errors: Record<string, string> = {};

  validateInput() {
    this.errors = {};
    const email = this.userEmail?.trim();
    if (!email) this.errors.email = "L'indirizzo email è obbligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) this.errors.email = 'Inserisci un indirizzo email valido';
    if (!this.userPassword) this.errors.password = 'La password è obbligatoria';
    else if (this.userPassword.length < 8) this.errors.password = 'La password deve essere lunga almeno 8 caratteri';
    return Object.keys(this.errors).length === 0;
  }

  validateNativeEmail(event: any) {
    const el = event.target as HTMLInputElement;
    if (el.validity.valueMissing) el.setCustomValidity("L'indirizzo email è obbligatorio");
    else if (el.validity.typeMismatch) el.setCustomValidity('Inserisci un indirizzo email valido');
    else el.setCustomValidity('');
    el.reportValidity();
  }

  logInUser() {
    if (!this.validateInput()) return;
    this.errors = {};
    this.api.post<any>('auth/login', { email: this.userEmail, password: this.userPassword }).subscribe({
      next: (res) => {
  this.auth.setToken(res?.access_token ?? null);
        this.userEmail = '';
        this.userPassword = '';
        this.errors = {};
        this.toast.add('Bentornato!', 'success');
  const redirect = this.route.snapshot.queryParamMap.get('redirect');
  if (redirect) this.router.navigateByUrl(redirect);
  else this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err?.error) this.errors.server = 'Email o password errati'; else this.errors.server = 'Errore di connessione';
        this.toast.add(this.errors.server, 'error');
      }
    });
  }
}
