// src/types.ts

export interface Partida {
  id?: number;
  cantidad: number;
  descripcion: string;
  costo: number;
}

export interface Bitacora {
  id: number;
  cliente: string;
  fecha: string;
  partidas: Partida[];
}

export interface ReporteData {
  total_partidas: number;
  costo_total: string;
  bitacoras_filtradas: Bitacora[];
}
