import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, NgIf],
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  isAuth = computed(() => this.auth.isAuthenticated());
  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
