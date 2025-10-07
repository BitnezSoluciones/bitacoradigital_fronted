// src/hooks/useApi.ts
import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const auth = useAuth();

  const request = useCallback(async (
    endpoint: string,
    method: string,
    body: unknown = null,
    params: URLSearchParams | null = null
  ) => {
    setLoading(true);
    setError(null);
    let url = `${API_BASE_URL}/${endpoint}`;
    if (params && params.toString()) {
      url += `?${params.toString()}`;
    }

    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (auth.token) {
      headers['Authorization'] = `Token ${auth.token}`;
    }

    const options: RequestInit = { method, headers };
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        if (response.status === 401) auth.logout();
        throw new Error(`Error: ${response.statusText}`);
      }
      if (response.status === 204) return true;
      return await response.json();
    } catch (e) {
      setError(e as Error);
      console.error(`Error en ${method} para ${url}`, e);
      return null;
    } finally {
      setLoading(false);
    }
  }, [auth]);

  // 🔹 Método específico para marcar como pagado
  const marcarComoPagado = useCallback(async (
    bitacoraId: number,
    data: {
      metodo_pago: string;
      fecha_pago?: string;
      folio_factura?: string;
      notas_pago?: string;
    }
  ) => {
    return await request(`bitacoras/${bitacoraId}/marcar_pagado/`, 'POST', data);
  }, [request]);

  // 🔹 Método para cambiar estado
  const cambiarEstado = useCallback(async (
    bitacoraId: number,
    nuevoEstado: string
  ) => {
    return await request(`bitacoras/${bitacoraId}/cambiar_estado/`, 'POST', {
      estado: nuevoEstado
    });
  }, [request]);

  return { loading, error, request, marcarComoPagado, cambiarEstado };
};