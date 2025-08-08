import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../shared/toast/toast.service';
import { Task, Moment } from '../../core/models/task.model';

@Component({
  standalone: true,
  imports: [NgIf, NgFor, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto">
      <div *ngIf="isLoading()" class="rounded shadow p-4" aria-busy="true">
        <div class="animate-pulse h-6 w-1/2 bg-slate-200 mb-2"></div>
        <div class="animate-pulse h-4 w-3/4 bg-slate-200"></div>
      </div>

      <div *ngIf="!isLoading() && error()" class="p-3 border rounded bg-amber-50 border-amber-200 text-amber-900">{{ error() }}</div>

      <div *ngIf="!isLoading() && task() as t" class="rounded shadow p-4 border-l-4" [style.borderLeftColor]="t.category?.color || '#2563eb'">
        <div class="flex items-start justify-between gap-3">
          <div>
            <a routerLink="/tasks" class="text-blue-600 text-sm">← Indietro</a>
            <h1 class="text-2xl font-semibold mt-1">{{ t.name }}</h1>
            <div class="flex flex-wrap gap-2 mt-2 text-sm">
              <span *ngIf="t.category" class="inline-flex items-center gap-1 px-2 py-1 rounded-full border">
                <span class="w-2 h-2 rounded-full" [style.background]="t.category?.color"></span>
                {{ t.category?.name }}
              </span>
              <span *ngIf="t.priority" class="inline-flex items-center gap-1 px-2 py-1 rounded-full border">
                <span class="w-2 h-2 rounded-full" [style.background]="t.priority?.color"></span>
                {{ t.priority?.name }}
              </span>
              <span *ngIf="t.status" class="inline-flex items-center gap-1 px-2 py-1 rounded-full border">
                <span class="w-2 h-2 rounded-full" [style.background]="t.status?.color"></span>
                {{ t.status?.name }}
              </span>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <button *ngIf="showStart()" class="px-3 py-2 bg-blue-600 text-white rounded" [disabled]="isUpdating()" (click)="startTask()">{{ startLabel() }}</button>
            <button *ngIf="showStop()" class="px-3 py-2 border rounded" [disabled]="isUpdating()" (click)="stopTask()">Interrompi</button>
            <button class="px-3 py-2 bg-emerald-600 text-white rounded" [disabled]="isUpdating()" (click)="completeTask()">Completa</button>
            <a class="px-3 py-2 border rounded" [routerLink]="['/moments/new']" [queryParams]="{ id: t.id }">Aggiungi Momento</a>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-3 mt-3 text-sm">
          <div class="border rounded p-2">
            <div class="text-slate-500">Tempo stimato</div>
            <div class="font-semibold">{{ t.estimated_time }} min <span *ngIf="t.estimated_time">({{ formatEstimated(t.estimated_time) }})</span></div>
          </div>
          <div class="border rounded p-2" *ngIf="t.started_at">
            <div class="text-slate-500">Iniziato</div>
            <div class="font-semibold">{{ formatDate(t.started_at) }}</div>
          </div>
          <div class="border rounded p-2" *ngIf="t.deadline">
            <div class="text-slate-500">Scadenza</div>
            <div class="font-semibold">{{ formatDate(t.deadline) }}</div>
          </div>
        </div>

        <section class="mt-4">
          <h2 class="text-lg font-semibold mb-1">Descrizione</h2>
          <p class="text-slate-700">{{ t.description || 'Nessuna descrizione fornita.' }}</p>
        </section>

        <section class="mt-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Momenti</h2>
            <a class="px-2 py-1 text-sm border rounded" [routerLink]="['/moments/new']" [queryParams]="{ id: t.id }">+ Aggiungi</a>
          </div>
          <div *ngIf="momentCardData().length; else noMoments" class="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
            <div *ngFor="let mc of momentCardData()" class="border rounded p-3">
              <div class="font-semibold">{{ mc.name }}</div>
              <div class="text-slate-600 text-sm">{{ mc.message }}</div>
            </div>
          </div>
          <ng-template #noMoments>
            <p class="text-slate-600 mt-2">Nessun momento registrato.</p>
          </ng-template>
        </section>
      </div>
    </div>
  `,
})
export class TaskShowPage {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private toast = inject(ToastService);

  id = this.route.snapshot.paramMap.get('id')!;
  task = signal<Task | null>(null);
  isLoading = signal<boolean>(true);
  isUpdating = signal<boolean>(false);
  error = signal<string>('');
  momentCardData = signal<{ id: number; task_id: number; moments_type_id?: number; emotion_id?: number; name: string; message?: string }[]>([]);

  constructor() {
    this.fetchTask();
  }

  fetchTask() {
    this.isLoading.set(true);
    this.error.set('');
    this.api.get<any>(`tasks/${this.id}/show`).subscribe({
      next: (res) => {
        const t: Task | null = res?.task || null;
        this.task.set(t);
        const moments: Moment[] = t?.moments || [];
        this.momentCardData.set(moments.map(m => ({
          id: m.id, task_id: m.task_id, moments_type_id: m.moments_type_id, emotion_id: m.emotion_id, name: m.name, message: m.message,
        })));
      },
      error: (e) => {
        if (e?.status === 404) this.error.set("Task non disponibile o non appartenente all'utente.");
        else this.error.set('Errore nel caricamento della task.');
        this.task.set(null);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  showStart = computed(() => !!this.task() && this.task()!.status_id !== 2);
  showStop = computed(() => !!this.task() && this.task()!.status_id === 2);
  startLabel = computed(() => (this.task() && this.task()!.status_id === 4 ? 'Riavvia' : 'Avvia'));

  async updateStatus(next: number) {
    const t = this.task();
    if (!t) return;
    this.isUpdating.set(true);
    this.api.patch<any>(`tasks/${t.id}/status`, { status_id: next }).subscribe({
      next: (data) => {
        // Some backends may return empty body or plain text; treat success status as success
        this.toast.add((data && data.message) ? data.message : 'Stato della task aggiornato.', 'success');
        this.fetchTask();
      },
      error: (e) => {
        // If server updated but responded with non-JSON/empty and client tries to parse, Angular might surface as error.
        // If we detect status 200-204 treated as error due to parse, fallback to success UX and refresh.
        const status = e?.status;
        if (status >= 200 && status < 300) {
          this.toast.add('Stato della task aggiornato.', 'success');
          this.fetchTask();
        } else if (status === 404) this.toast.add('Task non disponibile o non appartenente.', 'warning');
        else if (status === 422) this.toast.add("Dati non validi per l'aggiornamento.", 'error');
        else this.toast.add('Errore nell\'aggiornamento dello stato.', 'error');
      },
      complete: () => this.isUpdating.set(false),
    });
  }

  startTask() { this.updateStatus(2); }
  stopTask() { this.updateStatus(4); }
  completeTask() { this.updateStatus(3); }

  formatEstimated(totalMinutes: number) {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    return `${m}m`;
  }
  formatDate(val: string | number | Date) {
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return String(val);
      return d.toLocaleString();
    } catch {
      return String(val);
    }
  }
}
