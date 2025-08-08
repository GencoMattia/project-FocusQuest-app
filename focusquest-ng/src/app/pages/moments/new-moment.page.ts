import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  template: `
    <div class="max-w-md mx-auto">
      <h1 class="text-2xl font-semibold">Crea un nuovo Momento</h1>
      <h2 class="text-slate-600 mb-4">per la task: {{ task?.name || '—' }}</h2>
      <form (ngSubmit)="submitForm()" class="space-y-3">
        <div>
          <label class="block text-sm mb-1">Nome Momento</label>
          <input class="w-full border rounded px-3 py-2" name="name" [(ngModel)]="momentData.name" (input)="clearValidationMessage('name')" placeholder="Nome momento" />
          <div class="text-rose-600 text-sm" *ngIf="errors.name">{{ errors.name }}</div>
        </div>
        <div>
          <label class="block text-sm mb-1">Messaggio</label>
          <input class="w-full border rounded px-3 py-2" name="message" [(ngModel)]="momentData.message" (input)="clearValidationMessage('message')" placeholder="Messaggio (max 150 caratteri)" />
          <div class="text-rose-600 text-sm" *ngIf="errors.message">{{ errors.message }}</div>
        </div>
        <div>
          <label class="block text-sm mb-1">Emozione</label>
          <select class="w-full border rounded px-3 py-2" name="emotion_id" [(ngModel)]="momentData.emotion_id">
            <option [ngValue]="0" disabled>Seleziona un'emozione</option>
            <option *ngFor="let e of emotions" [ngValue]="e.id">{{ e.name }}</option>
          </select>
          <div class="text-rose-600 text-sm" *ngIf="errors.emotion_id">{{ errors.emotion_id }}</div>
        </div>
        <div>
          <label class="block text-sm mb-1">Tipo di Momento</label>
          <select class="w-full border rounded px-3 py-2" name="moments_type_id" [(ngModel)]="momentData.moments_type_id">
            <option [ngValue]="0" disabled>Seleziona un tipo</option>
            <option *ngFor="let m of moment_types" [ngValue]="m.id">{{ m.name }}</option>
          </select>
          <div class="text-rose-600 text-sm" *ngIf="errors.moments_type_id">{{ errors.moments_type_id }}</div>
        </div>
        <div class="text-rose-600 text-sm" *ngIf="errors.server">{{ errors.server }}</div>
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded w-full">Crea Momento</button>
      </form>
    </div>
  `,
})
export class NewMomentPage {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  emotions: any[] = [];
  moment_types: any[] = [];
  task: any = {};

  momentData = { name: '', task_id: 0, message: '', emotion_id: 0, moments_type_id: 0 };
  errors: Record<string, string> = {};

  constructor() { this.getFormData(); }

  getFormData() {
    const id = this.route.snapshot.queryParamMap.get('id') || undefined;
    const params: any = {};
    if (id) params.task_id = id;
    this.api.get<any>('moments/form-data', params).subscribe({
      next: (res) => {
        const d = res?.data || {};
        this.emotions = d.emotions || [];
        this.moment_types = d.moment_types || [];
        this.task = d.task || {};
      },
      error: (e) => {
        if (e?.status === 404) this.errors.server = "Task non disponibile o non appartenente all'utente.";
        else this.errors.server = 'Errore nel caricamento dei dati del form.';
      }
    });
  }

  validateInput() {
    this.errors = {};
    if (!this.momentData.name) this.errors.name = 'Ogni momento deve avere un nome';
    else if (this.momentData.name.length < 3 || this.momentData.name.length > 150) this.errors.name = 'Il nome deve essere compreso tra 3 e 150 caratteri';
    if ((this.momentData.message || '').length > 150) this.errors.message = 'Il messaggio può essere lungo al massimo 150 caratteri';
    if (!this.momentData.emotion_id) this.errors.emotion_id = "Seleziona un'emozione";
    if (!this.momentData.moments_type_id) this.errors.moments_type_id = 'Seleziona un tipo di momento';
    return Object.keys(this.errors).length === 0;
  }

  clearValidationMessage(field: string) { this.errors[field] = ''; }

  submitForm() {
    if (!this.validateInput()) return;
    this.api.post<any>(`moments/tasks/${this.task?.id}/moments`, {
      name: this.momentData.name,
      message: this.momentData.message,
      emotion_id: this.momentData.emotion_id,
      moments_type_id: this.momentData.moments_type_id,
    }).subscribe({
      next: () => {
  this.errors = {};
  // Redirect to the related task details after successful creation
  const id = this.task?.id;
  if (id) this.router.navigate(['/tasks', id]);
  else this.router.navigate(['/tasks']);
      },
      error: (err) => {
        if (err?.status === 404) this.errors.server = "Task non disponibile o non appartenente all'utente.";
        else if (err?.status === 422 && err?.error?.errors) {
          const er = err.error.errors; Object.keys(er).forEach(k => this.errors[k] = Array.isArray(er[k]) ? er[k][0] : er[k]);
        } else this.errors.server = 'Errore durante la creazione del momento';
      }
    });
  }
}
