import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },
  { path: 'login', loadComponent: () => import('./pages/auth/login.page').then(m => m.LoginPage) },
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage) },
  { path: 'tasks', canActivate: [authGuard], loadComponent: () => import('./pages/tasks/task-index.page').then(m => m.TaskIndexPage) },
  { path: 'tasks/new', canActivate: [authGuard], loadComponent: () => import('./pages/tasks/new-task.page').then(m => m.NewTaskPage) },
  { path: 'tasks/:id', canActivate: [authGuard], loadComponent: () => import('./pages/tasks/task-show.page').then(m => m.TaskShowPage) },
  { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage) },
  { path: 'moments/new', canActivate: [authGuard], loadComponent: () => import('./pages/moments/new-moment.page').then(m => m.NewMomentPage) },
  { path: '404', loadComponent: () => import('./pages/not-found/not-found.page').then(m => m.NotFoundPage) },
  { path: '**', pathMatch: 'full', redirectTo: '404' },
];
