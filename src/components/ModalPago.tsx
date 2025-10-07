// src/components/ModalPago.tsx

import { useState } from 'react';
import type { Bitacora, MetodoPago } from '../types';  
import { METODOS_PAGO_OPTIONS } from '../types'; 

interface ModalPagoProps {
  bitacora: Bitacora;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    metodo_pago: MetodoPago;
    fecha_pago?: string;
    folio_factura?: string;
    notas_pago?: string;
  }) => Promise<void>;
}

export const ModalPago = ({ bitacora, isOpen, onClose, onConfirm }: ModalPagoProps) => {
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo');
  const [fechaPago, setFechaPago] = useState(new Date().toISOString().split('T')[0]);
  const [folioFactura, setFolioFactura] = useState('');
  const [notasPago, setNotasPago] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm({
        metodo_pago: metodoPago,
        fecha_pago: fechaPago,
        folio_factura: folioFactura,
        notas_pago: notasPago,
      });
      onClose();
    } catch (error) {
      console.error('Error al marcar como pagado:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">💰 Registrar Pago</h2>
        
        <div className="modal-info-box">
          <p className="modal-info-text">
            <strong>Cliente:</strong> {bitacora.cliente}
          </p>
          <p className="modal-total">
            Total: ${bitacora.total.toFixed(2)}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Método de Pago *</label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value as MetodoPago)}
              required
            >
              {METODOS_PAGO_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Fecha de Pago</label>
            <input
              type="date"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Folio de Factura (opcional)</label>
            <input
              type="text"
              value={folioFactura}
              onChange={(e) => setFolioFactura(e.target.value)}
              placeholder="Ej: A-12345"
            />
          </div>

          <div className="form-group">
            <label>Notas (opcional)</label>
            <textarea
              value={notasPago}
              onChange={(e) => setNotasPago(e.target.value)}
              placeholder="Observaciones sobre el pago..."
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Guardando...' : '✅ Confirmar Pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};