import { supabase } from './supabaseClient';

export const API_BASE = window.location.port === '5173' ? 'http://localhost:8000' : '';

/**
 * Wraps window.fetch, attaching the current Supabase session's access token
 * as a Bearer token so the backend knows which account is making the call.
 * Every request to our own FastAPI backend should go through this instead
 * of calling fetch() directly.
 */
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(`${API_BASE}${path}`, { ...options, headers });
}
