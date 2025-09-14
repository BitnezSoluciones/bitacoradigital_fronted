// frontend/src/types.ts

export interface Partida {
  id?: number;
  cantidad: number;
  descripcion: string;
}

export interface Bitacora {
  id: number;
  cliente: string;
  fecha: string;
  partidas: Partida[];
}