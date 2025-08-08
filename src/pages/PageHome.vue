<script>
import { RouterLink } from 'vue-router';

export default {
    components: { RouterLink },
};
</script>

<template>
    <main class="home">
        <!-- HERO -->
        <section class="hero container">
            <div class="row align-items-center g-4">
                <div class="col-lg-6 order-2 order-lg-1">
                    <p class="eyebrow">Tasking, ma più umano</p>
                    <h1 class="title">Rimani focussato, conquista le tue missioni</h1>
                    <p class="subtitle">FocusQuest unisce priorità, tempo e stato d’animo per aiutarti a finire le cose con serenità.</p>
                    <div class="cta-group">
                        <RouterLink class="btn btn-primary btn-lg" :to="{ name: 'dashboard' }">Vai alla Dashboard</RouterLink>
                        <RouterLink class="btn btn-outline-primary btn-lg" :to="{ name: 'tasks.create' }">Crea una Task</RouterLink>
                    </div>
                    <ul class="hero-points">
                        <li>Priorità intelligenti in base al tempo disponibile</li>
                        <li>Traccia emozioni e momenti chiave</li>
                        <li>UI chiara, leggera, accessibile</li>
                    </ul>
                </div>
                <div class="col-lg-6 order-1 order-lg-2">
                    <div class="hero-media">
                        <img src="../assets/img/Jumbo-img.jpg" alt="Illustrazione gestione task" class="img-fluid" />
                    </div>
                </div>
            </div>
        </section>

        <!-- HIGHLIGHTS -->
        <section class="highlights container">
            <div class="row row-cols-1 row-cols-md-3 g-3">
                <div class="col">
                    <article class="h-card">
                        <h3>Prioritizzazione</h3>
                        <p>Suggerimenti dinamici in base al tempo: poco o molto, trovi la prossima mossa.</p>
                    </article>
                </div>
                <div class="col">
                    <article class="h-card">
                        <h3>Momenti & Emozioni</h3>
                        <p>Registra momenti ed emozioni per capire come lavori meglio.</p>
                    </article>
                </div>
                <div class="col">
                    <article class="h-card">
                        <h3>Design Inclusivo</h3>
                        <p>Contrasto elevato, focus ring, e componenti coerenti con il tema.</p>
                    </article>
                </div>
            </div>
        </section>

        <!-- CTA STRIP -->
        <section class="cta-strip">
            <div class="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
                <div>
                    <h2 class="strip-title">Inizia adesso</h2>
                    <p class="strip-sub">Crea la tua prima task o organizza la giornata in pochi secondi.</p>
                </div>
                <div class="d-flex gap-2">
                    <RouterLink class="btn btn-primary" :to="{ name: 'tasks.create' }">Nuova Task</RouterLink>
                    <RouterLink class="btn btn-outline-primary" :to="{ name: 'tasks.index' }">Vai alle Task</RouterLink>
                </div>
            </div>
        </section>
    </main>
</template>


<style scoped lang="scss">
@use "../assets/partials/_variables.scss" as *;

.home { font-family: $font-family-base; color: $text-color; }

.hero { padding: 3.5rem 0; }
.eyebrow { color: $accent-color; font-weight: 700; margin: 0 0 .25rem; }
.title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; line-height: 1.1; margin: 0 0 .5rem; color: $text-color; text-shadow: 0 1px 2px rgba(0,0,0,0.08); }
.subtitle { font-size: 1.125rem; color: $text-color; opacity: .85; margin-bottom: 1rem; }
.cta-group { display: flex; gap: .75rem; flex-wrap: wrap; margin: 1rem 0 1.25rem; }
.cta-group .btn-primary { background-color: $btn-primary-bg; border: none; }
.cta-group .btn-outline-primary { color: #fff; border-color: rgba(255,255,255,.6); background-color: rgba(255,255,255,.08); }
.cta-group .btn-outline-primary:hover { background-color: rgba(255,255,255,.15); color: #fff; }
.hero-points { list-style: none; padding: 0; margin: 0; display: grid; gap: .4rem; color: $text-color; }

.hero-media { position: relative; }
.hero-media img { border-radius: var(--radius-lg); box-shadow: var(--shadow-2); }

.highlights { padding: 2rem 0 3rem; }
.h-card { background: var(--color-surface); border-radius: var(--radius-md); padding: 1.25rem; box-shadow: var(--shadow-1); height: 100%; }
.h-card h3 { color: $primary-color; font-weight: 700; font-size: 1.25rem; margin: 0 0 .25rem; }
.h-card p { margin: 0; }

.cta-strip { background: color-mix(in oklab, var(--color-surface), var(--color-primary) 10%); padding: 1.25rem 0; border-top: 1px solid color-mix(in oklab, var(--color-primary), #000 6%); border-bottom: 1px solid color-mix(in oklab, var(--color-primary), #000 6%); }
.strip-title { margin: 0; font-weight: 800; }
.strip-sub { margin: 0; color: $color-muted; }
</style>
