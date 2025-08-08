import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  get<T>(url: string, params?: Record<string, string | number | boolean | undefined>) {
    const httpParams = new HttpParams({ fromObject: Object.fromEntries(Object.entries(params || {}).filter(([,v]) => v !== undefined).map(([k,v]) => [k, String(v)])) });
    return this.http.get<T>(`${this.baseUrl}${url}`, { params: httpParams });
  }
  post<T>(url: string, body: unknown) {
    return this.http.post<T>(`${this.baseUrl}${url}`, body);
  }
  patch<T>(url: string, body: unknown) {
    return this.http.patch<T>(`${this.baseUrl}${url}`, body);
  }
}
