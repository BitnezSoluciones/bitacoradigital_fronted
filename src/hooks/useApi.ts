// src/hooks/useApi.ts

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

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const request = useCallback(async (
    method: string, 
    endpoint: string, 
    body: unknown = null
  ) => {
    setLoading(true);
    setError(null);
    const url = `${API_BASE_URL}/${endpoint}`;

    // Aquí iría la lógica para obtener el Token de Auth, la añadiremos después
    const csrftoken = getCookie('csrftoken'); 

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken || '',
        // 'Authorization': `Token ${token}` // <-- Futuro
      },
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      if (response.status === 204) { return true; }
      return await response.json();
    } catch (e) {
      setError(e as Error);
      console.error(`Error en ${method} para ${url}`, e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, request };
};