export interface LoginResponse {
  access_token: string;
  user: { id: number; name: string; surname?: string; email: string };
  name?: string; // compat
  surname?: string; // compat
}

export interface RegisterRequest {
  email: string;
  name: string;
  surname: string;
  password: string;
  password_confirmation: string;
}
