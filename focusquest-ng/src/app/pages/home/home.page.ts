import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-home-page',
  template: `
    <main class="home text-slate-900">
      <!-- HERO -->
      <section class="container mx-auto max-w-6xl px-4 py-12">
        <div class="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <p class="text-blue-600 font-semibold">Tasking, ma più umano</p>
            <h1 class="text-4xl md:text-5xl font-extrabold leading-tight mt-1">Rimani focussato, conquista le tue missioni</h1>
            <p class="text-slate-600 mt-3">FocusQuest unisce priorità, tempo e stato d’animo per aiutarti a finire le cose con serenità.</p>
            <div class="flex gap-3 flex-wrap mt-4">
              <a routerLink="/dashboard" class="px-4 py-2 bg-blue-600 text-white rounded">Vai alla Dashboard</a>
              <a routerLink="/tasks/new" class="px-4 py-2 border rounded">Crea una Task</a>
            </div>
            <ul class="mt-4 space-y-1 text-slate-700 list-disc list-inside">
              <li>Priorità intelligenti in base al tempo disponibile</li>
              <li>Traccia emozioni e momenti chiave</li>
              <li>UI chiara, leggera, accessibile</li>
            </ul>
          </div>
          <div>
            <img src="/assets/img/Jumbo-img.jpg" alt="Illustrazione gestione task" class="rounded-lg shadow" />
          </div>
        </div>
      </section>

      <!-- HIGHLIGHTS -->
      <section class="container mx-auto max-w-6xl px-4 py-10">
        <div class="grid md:grid-cols-3 gap-4">
          <article class="bg-white rounded-md shadow p-4">
            <h3 class="text-blue-600 font-semibold text-lg">Prioritizzazione</h3>
            <p class="text-slate-700">Suggerimenti dinamici in base al tempo: poco o molto, trovi la prossima mossa.</p>
          </article>
          <article class="bg-white rounded-md shadow p-4">
            <h3 class="text-blue-600 font-semibold text-lg">Momenti & Emozioni</h3>
            <p class="text-slate-700">Registra momenti ed emozioni per capire come lavori meglio.</p>
          </article>
          <article class="bg-white rounded-md shadow p-4">
            <h3 class="text-blue-600 font-semibold text-lg">Design Inclusivo</h3>
            <p class="text-slate-700">Contrasto elevato, focus ring, e componenti coerenti con il tema.</p>
          </article>
        </div>
      </section>

      <!-- CTA STRIP -->
      <section class="py-6 bg-blue-50 border-y">
        <div class="container mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-extrabold">Inizia adesso</h2>
            <p class="text-slate-600">Crea la tua prima task o organizza la giornata in pochi secondi.</p>
          </div>
          <div class="flex gap-2">
            <a routerLink="/tasks/new" class="px-4 py-2 bg-blue-600 text-white rounded">Nuova Task</a>
            <a routerLink="/tasks" class="px-4 py-2 border rounded">Vai alle Task</a>
          </div>
        </div>
      </section>
    </main>
  `,
})
export class HomePage {}
