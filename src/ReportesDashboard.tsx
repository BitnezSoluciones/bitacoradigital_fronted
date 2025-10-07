// frontend/src/ReportesDashboard.tsx

import { useState } from 'react';
import type { ReporteData } from './types';
import { useApi } from './hooks/useApi';

export const ReportesDashboard = () => {
  // --- ESTADOS ---
  const [filtros, setFiltros] = useState({ cliente: '', fecha_after: '', fecha_before: '' });
  const [reporteData, setReporteData] = useState<ReporteData | null>(null);
  const { loading, error, request } = useApi(); // Usamos nuestro hook universal

  // --- MANEJADORES ---
  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleGenerarReporte = async (e: React.FormEvent) => {
    e.preventDefault();
    setReporteData(null); // Limpiamos los resultados anteriores

    // 1. Construimos los parámetros de búsqueda de forma dinámica
    const params = new URLSearchParams();
    if (filtros.cliente) params.append('cliente__icontains', filtros.cliente);
    if (filtros.fecha_after) params.append('fecha_after', filtros.fecha_after);
    if (filtros.fecha_before) params.append('fecha_before', filtros.fecha_before);
    
    // 3. Llamamos a la API con nuestro hook
    const data = await request('GET', 'bitacoras/resumen/', null, params);
    
    if (data) {
      setReporteData(data);
    }
  };

  // --- RENDERIZADO ---
  return (
    <div className="card">
      <h1 className="title">Panel de Reportes de Facturación</h1>
      
      <form onSubmit={handleGenerarReporte} className="report-form">
        <input name="cliente" type="text" placeholder="Filtrar por cliente..." value={filtros.cliente} onChange={handleFiltroChange} />
        <input name="fecha_after" type="date" value={filtros.fecha_after} onChange={handleFiltroChange} />
        <input name="fecha_before" type="date" value={filtros.fecha_before} onChange={handleFiltroChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Generando...' : 'Generar Reporte'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>Error al cargar el reporte.</p>}

      {reporteData && (
        <div className="report-results">
          <h2>Resumen del Reporte</h2>
          <div className="summary-cards">
            <div className="summary-card">
              <span>Total a Facturar</span>
              <strong>${reporteData.costo_total}</strong>
            </div>
            <div className="summary-card">
              <span>Total de Partidas</span>
              <strong>{reporteData.total_partidas}</strong>
            </div>
          </div>

          <h3>Detalle de Bitácoras Incluidas ({reporteData.bitacoras_filtradas.length})</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Partidas</th>
                <th>Costo Total</th>
              </tr>
            </thead>
            <tbody>
              {reporteData.bitacoras_filtradas.map(bitacora => (
                <tr key={bitacora.id}>
                  <td>{bitacora.cliente}</td>
                  <td>{bitacora.fecha}</td>
                  <td>
                    <ul className="partidas-list-report">
                      {bitacora.partidas.map(partida => (
                        <li key={partida.id}>{partida.cantidad} - {partida.descripcion} (${partida.costo})</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <strong>
                      ${bitacora.partidas.reduce((total, partida) => total + Number(partida.costo), 0).toFixed(2)}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};