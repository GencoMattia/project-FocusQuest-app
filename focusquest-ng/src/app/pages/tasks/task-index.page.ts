import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../shared/toast/toast.service';
import { Task } from '../../core/models/task.model';

@Component({
  standalone: true,
  imports: [RouterLink, NgIf, NgFor],
  template: `
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-semibold">Elenco delle tue task</h2>
      <a routerLink="/tasks/new" class="px-3 py-2 bg-blue-600 text-white rounded">Nuova Task</a>
    </div>

    <div *ngIf="isLoading()" class="rounded shadow-sm p-3 space-y-2">
      <div class="animate-pulse bg-slate-200 h-7"></div>
      <div class="animate-pulse bg-slate-200 h-12"></div>
      <div class="animate-pulse bg-slate-200 h-12"></div>
    </div>

    <div *ngIf="!isLoading() && tasks().length" class="overflow-x-auto rounded shadow-sm">
      <table class="min-w-full text-sm">
        <thead class="bg-blue-50">
          <tr>
            <th class="px-3 py-2 text-left">Nome</th>
            <th class="px-3 py-2 text-left">Descrizione</th>
            <th class="px-3 py-2">Categoria</th>
            <th class="px-3 py-2">Priorità</th>
            <th class="px-3 py-2">Tempo stimato</th>
            <th class="px-3 py-2">Stato</th>
            <th class="px-3 py-2">Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let t of tasks()" class="border-t">
            <td class="px-3 py-2">{{ t.name }}</td>
            <td class="px-3 py-2">{{ t.description }}</td>
            <td class="px-3 py-2 text-center">{{ t.category?.name }}</td>
            <td class="px-3 py-2 text-center">{{ t.priority?.name }}</td>
            <td class="px-3 py-2 text-center">{{ t.estimated_time }} minuti</td>
            <td class="px-3 py-2 text-center">{{ t.status?.name }}</td>
            <td class="px-3 py-2 text-center">
              <button (click)="showTask(t.id)" class="px-2 py-1 bg-blue-600 text-white rounded text-xs">Mostra</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div *ngIf="!isLoading() && !tasks().length" class="p-3 border rounded text-center">
      Nessuna task trovata. Inizia creando una nuova task!
    </div>
  `,
})
export class TaskIndexPage {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private router = inject(Router);

  tasks = signal<Task[]>([]);
  isLoading = signal<boolean>(true);

  constructor() {
    this.getUserTask();
  }

  getUserTask() {
    this.isLoading.set(true);
    this.api.get<any>('tasks/index').subscribe({
      next: (res) => {
        const list = Array.isArray(res) ? res : (res?.tasks || []);
        this.tasks.set(list);
      },
      error: () => {
        this.tasks.set([]);
        this.toast.add('Errore durante il caricamento delle task.', 'error');
      },
      complete: () => this.isLoading.set(false),
    });
  }

  showTask(id: number) {
    this.router.navigate(['/tasks', id]);
  }
}
