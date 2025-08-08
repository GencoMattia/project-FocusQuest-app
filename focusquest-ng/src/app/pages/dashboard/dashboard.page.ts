import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  standalone: true,
  imports: [RouterLink, NgIf],
  template: `
    <div class="container mx-auto max-w-3xl mt-6">
      <div class="rounded shadow bg-white">
        <div class="border-b p-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold">
            <span *ngIf="userLoading()" class="inline-block bg-slate-200 h-6 w-44 animate-pulse"></span>
            <span *ngIf="!userLoading()">Benvenuto, {{ user().name || '—' }}!</span>
          </h3>
        </div>
        <div class="p-4">
          <div *ngIf="userLoading()">
            <div class="bg-slate-200 h-4 w-2/3 mb-2 animate-pulse"></div>
            <div class="bg-slate-200 h-4 w-1/3 animate-pulse"></div>
          </div>
          <div *ngIf="!userLoading()">
            <p class="text-slate-700">Questa è la tua dashboard.</p>
            <p class="text-slate-700"><strong>Email:</strong> {{ user().email }}</p>
            <p class="text-slate-700"><strong>User ID:</strong> {{ user().id }}</p>
          </div>
        </div>
      </div>

      <div class="rounded shadow bg-white mt-6 p-4">
        <div class="flex items-center justify-between">
          <div>
            <h5 class="font-semibold">🔥 Più Urgente</h5>
            <p class="text-slate-600">La task consigliata in base al tempo a disposizione.</p>
          </div>
          <div class="inline-flex border rounded overflow-hidden">
            <button class="px-3 py-1 text-sm" [class.bg-blue-600]="isAscending()" [class.text-white]="isAscending()" (click)="setAscending(true)">Poco</button>
            <button class="px-3 py-1 text-sm" [class.bg-blue-600]="!isAscending()" [class.text-white]="!isAscending()" (click)="setAscending(false)">Molto</button>
          </div>
        </div>
        <div *ngIf="taskLoading()" class="mt-3">
          <div class="bg-slate-200 h-5 w-1/2 mb-2 animate-pulse"></div>
          <div class="bg-slate-200 h-5 w-1/3 mb-2 animate-pulse"></div>
          <div class="bg-slate-200 h-10 w-full animate-pulse"></div>
        </div>
        <div *ngIf="!taskLoading()">
          <div class="mt-3">
            <div class="text-slate-500">Nome</div>
            <div class="font-semibold">{{ priorityTask().name || 'Nessuna task trovata' }}</div>
          </div>
          <div class="mt-2">
            <div class="text-slate-500">Tempo stimato</div>
            <div class="font-semibold">{{ priorityTask().estimated_time }} Minuti</div>
          </div>
          <div class="flex flex-wrap gap-2 mt-3" *ngIf="priorityTask() && priorityTask().id">
            <a [routerLink]="['/tasks', priorityTask().id]" class="px-3 py-2 bg-blue-600 text-white rounded">Dettagli</a>
            <button class="px-3 py-2 border rounded" (click)="startTask()">Avvia</button>
            <button class="px-3 py-2 bg-emerald-600 text-white rounded" (click)="completeTask()">Completa</button>
            <button class="px-3 py-2 border rounded" (click)="deferTask()">Rimanda</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardPage {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  user = signal<{ id?: number; name?: string; surname?: string; email?: string }>({});
  userLoading = signal(true);
  priorityTask = signal<any>({});
  isAscending = signal(true);
  taskLoading = signal(true);

  constructor() {
    this.fetchUserData();
    this.getPriorityTask();
  }

  fetchUserData() {
    this.userLoading.set(true);
    this.api.get<any>('users/show').subscribe({
      next: (res) => {
        const u = res?.user || {};
        this.user.set({ id: u.id, name: u.name, surname: u.surname, email: u.email });
      },
      error: (e) => console.error("Errore nel recupero dei dati dell'utente:", e),
      complete: () => this.userLoading.set(false),
    });
  }

  getPriorityTask() {
    this.taskLoading.set(true);
    this.api.get<any>('tasks/top-priority', { estimated_time_order: this.isAscending() ? 'asc' : 'desc' }).subscribe({
      next: (res) => { this.priorityTask.set(res?.task || {}); },
      error: () => { this.toast.add('Errore nel recupero della task con priorità.', 'error'); this.priorityTask.set({}); },
      complete: () => this.taskLoading.set(false),
    });
  }

  setAscending(v: boolean) { this.isAscending.set(v); this.getPriorityTask(); }
  startTask() { this.toast.add('Timer avviato.', 'success'); }
  completeTask() { this.toast.add('Task completata.', 'success'); }
  deferTask() { this.toast.add('Task rinviata.', 'warning'); }
}
