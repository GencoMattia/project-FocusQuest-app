export const environment = {
  production: false,
  // Prefer window.VITE_API_BASE_URL if provided at runtime; fallback to local dev API.
  apiBaseUrl:
    (typeof window !== 'undefined' && (window as any)["VITE_API_BASE_URL"]) ||
    'http://127.0.0.1:8000/api/',
};
