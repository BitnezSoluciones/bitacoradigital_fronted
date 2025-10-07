// src/BitacoraForm.tsx - CON PERMISOS

import { useState, useEffect } from 'react';
import type { Bitacora, Partida } from './types';
import { ESTADOS_PAGO_OPTIONS, METODOS_PAGO_OPTIONS } from './types';

interface BitacoraFormProps {
  onSave: (bitacora: Omit<Bitacora, 'id'> | Bitacora) => void | Promise<void>;
  bitacoraExistente?: Bitacora;
  onCancel?: () => void;
  isAdmin?: boolean; // 🔹 NUEVO: Indica si el usuario es admin
}

export const BitacoraForm = ({ 
  onSave, 
  bitacoraExistente, 
  onCancel,
  isAdmin = false // 🔹 Por defecto es false
}: BitacoraFormProps) => {
  const [cliente, setCliente] = useState('');
  const [fecha, setFecha] = useState('');
  const [partidas, setPartidas] = useState<Partida[]>([{ cantidad: 1, descripcion: '' }]);
  const [loading, setLoading] = useState(false);
  
  // 🔹 CAMPOS SOLO PARA ADMIN
  const [estadoPago, setEstadoPago] = useState('pendiente');
  const [metodoPago, setMetodoPago] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [folioFactura, setFolioFactura] = useState('');
  const [notasPago, setNotasPago] = useState('');

  useEffect(() => {
    if (bitacoraExistente) {
      setCliente(bitacoraExistente.cliente);
      setFecha(bitacoraExistente.fecha);
      setPartidas(bitacoraExistente.partidas);
      
      // Solo cargar estos campos si es admin
      if (isAdmin) {
        setEstadoPago(bitacoraExistente.estado_pago || 'pendiente');
        setMetodoPago(bitacoraExistente.metodo_pago || '');
        setFechaVencimiento(bitacoraExistente.fecha_vencimiento || '');
        setFolioFactura(bitacoraExistente.folio_factura || '');
        setNotasPago(bitacoraExistente.notas_pago || '');
      }
    }
  }, [bitacoraExistente, isAdmin]);

  const handlePartidaChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const nuevasPartidas = [...partidas];
    const { name, value } = event.target;
    
    if (name === 'cantidad') {
      nuevasPartidas[index] = {
        ...nuevasPartidas[index],
        cantidad: parseInt(value) || 0
      };
    } else if (name === 'descripcion') {
      nuevasPartidas[index] = {
        ...nuevasPartidas[index],
        descripcion: value
      };
    } else if (name === 'costo' && isAdmin) {
      // Solo admin puede editar costos
      nuevasPartidas[index] = {
        ...nuevasPartidas[index],
        costo: value
      };
    }
    
    setPartidas(nuevasPartidas);
  };

  const addPartida = () => {
    setPartidas([...partidas, { cantidad: 1, descripcion: '' }]);
  };

  const removePartida = (index: number) => {
    setPartidas(partidas.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data: any = { cliente, fecha, partidas };

      // 🔹 Solo incluir campos de admin si el usuario es admin
      if (isAdmin) {
        data.estado_pago = estadoPago;
        data.metodo_pago = metodoPago;
        data.fecha_vencimiento = fechaVencimiento || null;
        data.folio_factura = folioFactura;
        data.notas_pago = notasPago;
      }

      if (bitacoraExistente) {
        await onSave({ ...data, id: bitacoraExistente.id });
      } else {
        await onSave(data);
        // Limpiar formulario solo si es creación nueva
        setCliente('');
        setFecha('');
        setPartidas([{ cantidad: 1, descripcion: '' }]);
        if (isAdmin) {
          setEstadoPago('pendiente');
          setMetodoPago('');
          setFechaVencimiento('');
          setFolioFactura('');
          setNotasPago('');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="service-form">
      <fieldset>
        <legend>
          {bitacoraExistente
            ? `Editando Bitácora de ${bitacoraExistente.cliente}`
            : 'Datos del Cliente'}
        </legend>
        <input
          type="text"
          placeholder="Nombre del Cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          required
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </fieldset>

      <fieldset>
        <legend>Partidas del Servicio</legend>
        {partidas.map((partida, index) => (
          <div key={partida.id || index} className="partida-item">
            <input
              type="number"
              name="cantidad"
              placeholder="Cant."
              value={partida.cantidad}
              onChange={(e) => handlePartidaChange(index, e)}
              required
            />
            <input
              type="text"
              name="descripcion"
              placeholder="Descripción de la partida"
              value={partida.descripcion}
              onChange={(e) => handlePartidaChange(index, e)}
              required
            />
            
            {/* 🔹 CAMPO DE COSTO: SOLO VISIBLE PARA ADMIN */}
            {isAdmin && (
              <input
                type="number"
                name="costo"
                placeholder="$0.00"
                step="0.01"
                value={partida.costo || ''}
                onChange={(e) => handlePartidaChange(index, e)}
                style={{ maxWidth: '120px' }}
              />
            )}
            
            {partidas.length > 1 && (
              <button
                type="button"
                onClick={() => removePartida(index)}
                className="remove-btn"
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addPartida} className="add-btn">
          + Añadir Partida
        </button>
      </fieldset>

      {/* 🔹 SECCIÓN DE PAGO: SOLO VISIBLE PARA ADMIN */}
      {isAdmin && (
        <fieldset>
          <legend>Información de Pago (Solo Admin)</legend>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Estado de Pago
              </label>
              <select
                value={estadoPago}
                onChange={(e) => setEstadoPago(e.target.value)}
              >
                {ESTADOS_PAGO_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Método de Pago
              </label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
              >
                <option value="">No especificado</option>
                {METODOS_PAGO_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Folio de Factura
              </label>
              <input
                type="text"
                placeholder="Ej: A-12345"
                value={folioFactura}
                onChange={(e) => setFolioFactura(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Notas de Pago
            </label>
            <textarea
              placeholder="Observaciones sobre el pago..."
              value={notasPago}
              onChange={(e) => setNotasPago(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
            />
          </div>
        </fieldset>
      )}

      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="cancel-btn"
            disabled={loading}
          >
            Cancelar
          </button>
        )}
        <button type="submit" disabled={loading}>
          {loading
            ? 'Guardando...'
            : bitacoraExistente
            ? 'Actualizar Bitácora'
            : 'Guardar Bitácora'}
        </button>
      </div>
    </form>
  );
};