import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="py-16 text-center">
      <h1 class="text-4xl font-bold mb-2">404</h1>
      <p class="text-slate-600 mb-6">La pagina che cerchi non esiste.</p>
      <a routerLink="/" class="px-4 py-2 bg-blue-600 text-white rounded">Torna alla Home</a>
    </section>
  `,
})
export class NotFoundPage {}
