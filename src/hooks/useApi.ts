// frontend/src/hooks/useApi.ts

import { useState, useCallback } from 'react';

function getCookie(name: string): string | null {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const useApi = (endpoint: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const request = useCallback(async (method: string, body: unknown = null, id: number | null = null) => {
    setLoading(true);
    setError(null);
    const url = id ? `${API_BASE_URL}/${endpoint}/${id}/` : `${API_BASE_URL}/${endpoint}/`;
    const csrftoken = getCookie('csrftoken');
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken || '',
      },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.statusText}`);
      }
      if (response.status === 204) {
        return true;
      }
      return await response.json();
    } catch (e) {
      setError(e as Error);
      console.error(`Error en ${method} para ${url}`, e);
      return null;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const get = useCallback(() => request('GET'), [request]);
  const create = useCallback((data: unknown) => request('POST', data), [request]);
  const update = useCallback((id: number, data: unknown) => request('PUT', data, id), [request]);
  const remove = useCallback((id: number) => request('DELETE', null, id), [request]);

  return { loading, error, get, create, update, remove };
};