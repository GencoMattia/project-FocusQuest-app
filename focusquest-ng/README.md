# FocusQuest Angular 19 (Tailwind + Angular Material Icons)

This is a minimal Angular 19 scaffold to start migrating the FocusQuest frontend from Vue to Angular. It uses Tailwind CSS and Angular Material Icons.

## Run locally

1. Install dependencies

```
npm i
```

2. Start dev server

```
npm start
```

Then open http://localhost:4200.

## Structure

- src/main.ts: bootstrap with standalone components, router, http, animations
- src/app/app.routes.ts: routes
- src/app/shared/components/app-header: header with Material icons
- src/app/pages: simple placeholder pages (home, auth/login, dashboard, tasks, profile, moments)

## Notes
- Tailwind is configured via `tailwind.config.js` and `postcss.config.js`.
- Material icons are loaded via Google Fonts (`index.html`) and `<mat-icon>` in components.
- Replace ApiService baseUrl with your backend URL when wiring APIs.
