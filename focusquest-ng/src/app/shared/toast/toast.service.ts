import { Injectable, signal } from '@angular/core';

export interface Toast { id: number; message: string; variant: 'info'|'success'|'warning'|'error' }

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  add(message: string, variant: Toast['variant'] = 'info', timeout = 3000) {
    const id = Date.now() + Math.random();
    this.toasts.update(list => [...list, { id, message, variant }]);
    if (timeout) setTimeout(() => this.remove(id), timeout);
  }
  remove(id: number) { this.toasts.update(list => list.filter(t => t.id !== id)); }
}
