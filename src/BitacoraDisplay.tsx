// src/BitacoraDisplay.tsx

import type { Bitacora } from './types';
import { ESTADOS_PAGO_OPTIONS } from './types';

interface BitacoraDisplayProps {
  bitacora: Bitacora;
  onEdit: () => void;
  onDelete: () => void;
  onMarcarPagado?: () => void;
  isAdmin: boolean;
}

export const BitacoraDisplay = ({ 
  bitacora, 
  onEdit, 
  onDelete, 
  onMarcarPagado,
  isAdmin 
}: BitacoraDisplayProps) => {
  const reporteUrl = `http://127.0.0.1:8000/api/bitacoras/${bitacora.id}/reporte/`;
  
  // Obtener el color del estado
  const estadoConfig = ESTADOS_PAGO_OPTIONS.find(
    opt => opt.value === bitacora.estado_pago
  );
  const estadoColor = estadoConfig?.color || '#6c757d';

  return (
    <div className="display-container">
      <div className="service-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <h3 className="service-client" style={{ margin: 0 }}>
            {bitacora.cliente}
          </h3>
          <span 
            className="estado-badge"
            style={{ 
              backgroundColor: estadoColor,
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            {bitacora.estado_pago_display}
          </span>
          {bitacora.esta_vencido && (
            <span 
              style={{ 
                color: '#dc3545',
                fontWeight: 'bold',
                fontSize: '0.9rem' 
              }}
            >
               VENCIDO
            </span>
          )}
        </div>
        
        <p className="service-meta">
            {bitacora.fecha} | 
          {bitacora.tecnico_nombre && ` 👤 ${bitacora.tecnico_nombre} |`}
          {isAdmin && ` 💰 Total: $${bitacora.total.toFixed(2)}`}
        </p>

        {/* Información de pago (solo para admin) */}
        {isAdmin && bitacora.estado_pago === 'pagado' && (
          <p className="service-meta" style={{ color: '#28a745' }}>
               Pagado el {bitacora.fecha_pago} 
            {bitacora.metodo_pago_display && ` · ${bitacora.metodo_pago_display}`}
            {bitacora.folio_factura && ` · Folio: ${bitacora.folio_factura}`}
          </p>
        )}

        {bitacora.fecha_vencimiento && bitacora.estado_pago !== 'pagado' && (
          <p className="service-meta">
              Vence: {bitacora.fecha_vencimiento}
          </p>
        )}

        <ul className="partidas-list">
          {bitacora.partidas.map((partida, index) => (
            <li key={partida.id || index}>
              {partida.cantidad} - {partida.descripcion}
              {isAdmin && partida.costo && ` · $${partida.costo}`}
            </li>
          ))}
        </ul>

        {bitacora.notas_pago && isAdmin && (
          <p className="service-meta" style={{ 
            backgroundColor: '#fff3cd', 
            padding: '0.5rem', 
            borderRadius: '4px',
            marginTop: '0.5rem' 
          }}>
              <strong>Notas:</strong> {bitacora.notas_pago}
          </p>
        )}
      </div>

      <div className="service-actions">
        <button onClick={onEdit} className="edit-btn">Editar</button>
        <button onClick={onDelete} className="delete-btn">Eliminar</button>
        <a href={reporteUrl} target="_blank" rel="noopener noreferrer" className="report-btn">
            PDF
        </a>
        
        {/* Botón de marcar como pagado (solo admin y si no está pagado) */}
        {isAdmin && onMarcarPagado && bitacora.estado_pago !== 'pagado' && (
          <button 
            onClick={onMarcarPagado} 
            className="pago-btn"
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '0.4rem 0.8rem',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
              Marcar Pagado
          </button>
        )}
      </div>
    </div>
  );
};