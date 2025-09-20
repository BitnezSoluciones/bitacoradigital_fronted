// frontend/src/BitacoraDisplay.tsx

import type { Bitacora } from './types';

interface BitacoraDisplayProps {
  bitacora: Bitacora;
  onEdit: () => void;
  onDelete: () => void;
}

export const BitacoraDisplay = ({ bitacora, onEdit, onDelete }: BitacoraDisplayProps) => {
  const reporteUrl = `http://127.0.0.1:8000/api/bitacoras/${bitacora.id}/reporte/`;
  return (
    <div className="display-container">
      <div className="service-content">
        <h3 className="service-client">{bitacora.cliente}</h3>
        <p className="service-meta">{bitacora.fecha}</p>
        <ul className="partidas-list">
          {bitacora.partidas.map((partida, index) => (
            <li key={partida.id || index}>
              {partida.cantidad} - {partida.descripcion}
            </li>
          ))}
        </ul>
      </div>
      <div className="service-actions">
        {/* Usamos botones HTML estándar de nuevo */}
        <button onClick={onEdit} className="edit-btn">Editar</button>
        <button onClick={onDelete} className="delete-btn">Eliminar</button>
        <a href={reporteUrl} target="_blank" rel="noopener noreferrer" className="report-btn">Reporte PDF</a>
      </div>
    </div>
  );
};