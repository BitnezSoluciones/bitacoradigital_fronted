// src/types.ts

export interface Partida {
  id?: number;
  cantidad: number;
  descripcion: string;
  costo?: string;
  costo_unitario?: string;
}

// --- NUEVOS TIPOS PARA ESTADOS Y MÉTODOS ---
export type EstadoPago = 
  | 'pendiente' 
  | 'cotizado' 
  | 'facturado' 
  | 'pagado' 
  | 'vencido';

export type MetodoPago = 
  | 'efectivo' 
  | 'transferencia' 
  | 'cheque' 
  | 'tarjeta' 
  | 'credito' 
  | '';

export interface Bitacora {
  id: number;
  cliente: string;
  fecha: string;
  tecnico?: number;
  tecnico_nombre?: string;
  partidas: Partida[];
  
  // --- NUEVOS CAMPOS ---
  estado_pago: EstadoPago;
  estado_pago_display: string;
  metodo_pago: MetodoPago;
  metodo_pago_display: string;
  fecha_pago?: string;
  folio_factura?: string;
  fecha_vencimiento?: string;
  notas_pago?: string;
  total: number;
  esta_vencido: boolean;
  creado_en?: string;
  actualizado_en?: string;
}

export interface ReporteData {
  total_partidas: number;
  costo_total: string;
  totales_por_estado: {
    [key: string]: {
      nombre: string;
      cantidad: number;
      monto: number;
    };
  };
  bitacoras_vencidas: number;
  bitacoras_filtradas: Bitacora[];
}

export interface MarcarPagadoData {
  metodo_pago: MetodoPago;
  fecha_pago?: string;
  folio_factura?: string;
  notas_pago?: string;
}

// Opciones para los selects del frontend
export const ESTADOS_PAGO_OPTIONS = [
  { value: 'pendiente', label: '⏳ Pendiente', color: '#ffc107' },
  { value: 'cotizado', label: '💰 Cotizado', color: '#17a2b8' },
  { value: 'facturado', label: '📧 Facturado', color: '#6610f2' },
  { value: 'pagado', label: '✅ Pagado', color: '#28a745' },
  { value: 'vencido', label: '❌ Vencido', color: '#dc3545' },
];

export const METODOS_PAGO_OPTIONS = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'credito', label: 'Crédito' },
];