import { Component, computed, inject } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgFor, NgClass],
  template: `
    <div class="fixed top-4 right-4 space-y-2 z-50">
      <div *ngFor="let t of toasts()" class="px-3 py-2 rounded shadow text-white" [ngClass]="{
        'bg-slate-800': t.variant==='info',
        'bg-emerald-600': t.variant==='success',
        'bg-amber-600': t.variant==='warning',
        'bg-rose-600': t.variant==='error'
      }">
        {{ t.message }}
      </div>
    </div>
  `,
})
export class ToastContainerComponent {
  private toast = inject(ToastService);
  toasts = computed(() => this.toast.toasts());
}
