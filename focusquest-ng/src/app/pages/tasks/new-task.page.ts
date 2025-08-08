import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  template: `
    <h2 class="text-2xl font-semibold mb-4">Crea nuova Task</h2>
    <form class="space-y-3 max-w-md" (ngSubmit)="createNewTask()">
      <div>
        <label class="block text-sm mb-1">Task Name</label>
        <input class="w-full border rounded px-3 py-2" name="name" [(ngModel)]="data.formName" (input)="clearValidationMessage('name'); onNameChange()" placeholder="Enter task name" />
        <div class="text-rose-600 text-sm" *ngIf="errors.name">{{ errors.name }}</div>
        <ul class="mt-2 border rounded" *ngIf="showDropdown">
          <li class="px-2 py-1 hover:bg-slate-50 cursor-pointer" *ngFor="let s of suggestedTasks" (click)="fillForm(s)">{{ s.name }}</li>
          <li class="px-2 py-1 bg-blue-600 text-white cursor-pointer" (click)="onCreateNewTaskClick()">+ Create New Task</li>
        </ul>
      </div>

      <div>
        <label class="block text-sm mb-1">Description</label>
        <textarea class="w-full border rounded px-3 py-2" rows="4" name="description" [(ngModel)]="data.formDescription" (input)="clearValidationMessage('description')" placeholder="Enter task description"></textarea>
        <div class="text-rose-600 text-sm" *ngIf="errors.description">{{ errors.description }}</div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm mb-1">Hours</label>
          <input type="number" class="w-full border rounded px-3 py-2" name="hours" [(ngModel)]="data.formHours" min="0" />
        </div>
        <div>
          <label class="block text-sm mb-1">Minutes</label>
          <input type="number" class="w-full border rounded px-3 py-2" name="minutes" [(ngModel)]="data.formMinutes" min="0" max="59" (input)="clearValidationMessage('estimatedTime')" />
        </div>
        <div class="col-span-2 text-rose-600 text-sm" *ngIf="errors.estimatedTime">{{ errors.estimatedTime }}</div>
      </div>

      <div>
        <label class="block text-sm mb-1">Deadline</label>
        <input type="date" class="w-full border rounded px-3 py-2" name="deadline" [(ngModel)]="data.formDeadline" (input)="clearValidationMessage('deadline')" />
        <div class="text-rose-600 text-sm" *ngIf="errors.deadline">{{ errors.deadline }}</div>
      </div>

      <div>
        <label class="block text-sm mb-1">Category</label>
        <select class="w-full border rounded px-3 py-2" name="category" [(ngModel)]="data.formCategoryId">
          <option [ngValue]="0" disabled>Seleziona una categoria</option>
          <option *ngFor="let c of categories" [ngValue]="c.id">{{ c.name }}</option>
        </select>
        <div class="text-rose-600 text-sm" *ngIf="errors.category">{{ errors.category }}</div>
      </div>

      <div>
        <label class="block text-sm mb-1">Priority</label>
        <select class="w-full border rounded px-3 py-2" name="priority" [(ngModel)]="data.formPriorityId">
          <option [ngValue]="0" disabled>Seleziona una priorità</option>
          <option *ngFor="let p of priorities" [ngValue]="p.id">{{ p.name }}</option>
        </select>
        <div class="text-rose-600 text-sm" *ngIf="errors.priority">{{ errors.priority }}</div>
      </div>

      <div class="flex gap-3">
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded" [disabled]="isSubmitting">Submit</button>
        <button type="button" class="px-4 py-2 border rounded" (click)="resetForm()">Reset</button>
      </div>
    </form>
  `,
})
export class NewTaskPage {
  private api = inject(ApiService);
  private router = inject(Router);
  private toast = inject(ToastService);

  categories: any[] = [];
  statuses: any[] = [];
  priorities: any[] = [];
  data = {
    formName: '',
    formDescription: '',
    formHours: 0,
    formMinutes: 0,
    formCategoryId: 0,
    formPriorityId: 0,
    formDeadline: '',
  };
  suggestedTasks: any[] = [];
  showDropdown = false;
  taskSelected = false;
  errors: Record<string, string> = {};
  isSubmitting = false;
  lastFormName = '';
  private debounceHandle: any;

  constructor() { this.getData(); }

  getData() {
    this.api.get<any>('tasks/form-data').subscribe({
      next: (res) => {
        const d = res?.data || {};
        this.categories = d.categories || [];
        this.priorities = d.priorities || [];
        this.statuses = d.statuses || [];
      },
      error: () => console.error('Error loading form data'),
    });
  }

  onNameChange() {
    if (this.taskSelected) { this.taskSelected = false; return; }
    if (this.data.formName === this.lastFormName) return;
    this.lastFormName = this.data.formName;
    if (!this.data.formName || this.data.formName.length <= 1) {
      this.suggestedTasks = []; this.showDropdown = false; return;
    }
    clearTimeout(this.debounceHandle);
    this.debounceHandle = setTimeout(() => this.getSuggestedTask(), 300);
  }

  getSuggestedTask() {
    const q = this.data.formName;
    if (!q || q.length <= 1) { this.suggestedTasks = []; this.showDropdown = false; return; }
    this.api.get<any>(`tasks/suggest-tasks`, { query: q }).subscribe({
      next: (res) => { this.suggestedTasks = res?.tasks || []; this.showDropdown = true; },
      error: () => { this.suggestedTasks = []; this.showDropdown = true; },
    });
  }

  fillForm(task: any) {
    this.data.formName = task.name;
    this.data.formDescription = task.description;
    this.data.formHours = Math.floor((task.estimated_time || 0) / 60);
    this.data.formMinutes = (task.estimated_time || 0) % 60;
    this.data.formCategoryId = task.category_id;
    this.data.formPriorityId = task.priority_id;
    this.taskSelected = true;
    this.showDropdown = false;
    setTimeout(() => { this.taskSelected = false; });
  }

  validateInput() {
    this.errors = {};
    const name = this.data.formName?.trim();
    if (!name) this.errors.name = 'Ogni task deve avere un nome';
    else if (name.length < 3 || name.length > 150) this.errors.name = 'Il nome della task deve essere compreso tra 3 e 150 caratteri';
    if ((this.data.formDescription || '').length > 300) this.errors.description = 'La descrizione deve essere inferiore ai 300 caratteri';
    const h = Number(this.data.formHours); const m = Number(this.data.formMinutes);
    if (isNaN(h) || h < 0 || isNaN(m) || m < 0) this.errors.estimatedTime = 'Ore e minuti devono essere valori positivi';
    else if (m > 59) this.errors.estimatedTime = 'I minuti devono essere compresi tra 0 e 59';
    else if (h === 0 && m === 0) this.errors.estimatedTime = 'Devi inserire almeno 1 minuto o 1 ora';
    if (this.data.formDeadline) {
      const now = new Date(); const d = new Date(this.data.formDeadline); now.setHours(0,0,0,0);
      if (d < now) this.errors.deadline = 'La deadline non può essere precedente ad oggi';
    }
    if (!this.data.formCategoryId) this.errors.category = 'Seleziona una categoria';
    if (!this.data.formPriorityId) this.errors.priority = 'Seleziona una priorità';
    return Object.keys(this.errors).length === 0;
  }

  getTotalMinutes(h: number, m: number) { return (Number(h) * 60) + Number(m); }

  createNewTask() {
    if (this.isSubmitting) return;
    if (!this.validateInput()) return;
    this.isSubmitting = true;
    const estimated_time = this.getTotalMinutes(this.data.formHours, this.data.formMinutes);
    this.api.post<any>('tasks/create', {
      name: this.data.formName,
      description: this.data.formDescription,
      estimated_time,
      category_id: this.data.formCategoryId,
      priority_id: this.data.formPriorityId,
      deadline: this.data.formDeadline,
    }).subscribe({
      next: (res) => {
        const id = res?.task?.id;
        if (id) this.router.navigate(['/tasks', id]);
        this.resetForm();
      },
      error: (err) => {
        const er = err?.error?.errors;
        if (er) Object.keys(er).forEach(k => this.errors[k] = Array.isArray(er[k]) ? er[k][0] : er[k]);
        else this.errors['server'] = 'Errore durante la creazione della task';
      },
      complete: () => this.isSubmitting = false,
    });
  }

  resetForm() {
    this.data = { formName: '', formDescription: '', formHours: 0, formMinutes: 0, formCategoryId: 0, formPriorityId: 0, formDeadline: '' };
    this.suggestedTasks = []; this.showDropdown = false;
  }

  onCreateNewTaskClick() { this.showDropdown = false; this.suggestedTasks = []; this.taskSelected = true; setTimeout(() => this.taskSelected = false); }
  clearValidationMessage(field: string) { this.errors[field] = ''; }
}
