// frontend/src/ReportesDashboard.tsx

import { useState } from 'react';
import type { ReporteData } from './types';
import { useApi } from './hooks/useApi'; // Importamos nuestro hook mejorado

export const ReportesDashboard = () => {
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroFechaAfter, setFiltroFechaAfter] = useState('');
  const [filtroFechaBefore, setFiltroFechaBefore] = useState('');
  const [reporteData, setReporteData] = useState<ReporteData | null>(null);

  // Inicializamos el hook sin un endpoint por defecto
  const { loading, error, request } = useApi();

  const handleGenerarReporte = async (event: React.FormEvent) => {
    event.preventDefault();
    setReporteData(null);
    

    // 1. Construimos los parámetros de la URL de forma dinámica
    const params = new URLSearchParams();
    if (filtroCliente) {
      params.append('cliente__icontains', filtroCliente);
    }
    if (filtroFechaAfter) {
      params.append('fecha_after', filtroFechaAfter);
    }
    if (filtroFechaBefore) {
      params.append('fecha_before', filtroFechaBefore);
    }

    // 2. Creamos el endpoint final con los filtros
    const endpoint = `bitacoras/resumen/?${params.toString()}`;

    // 3. Llamamos a la API con nuestro hook
    const data = await request(endpoint, 'GET');

    if (data) {
      setReporteData(data);
    }
  };

  return (
    <div className="card">
      <h1 className="title">Panel de Reportes de Facturación</h1>

      <form onSubmit={handleGenerarReporte} className="report-form">
        <input 
          type="text" 
          placeholder="Filtrar por cliente..." 
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
        />
        <input 
          type="date" 
          value={filtroFechaAfter}
          onChange={(e) => setFiltroFechaAfter(e.target.value)}
        />
        <input 
          type="date" 
          value={filtroFechaBefore}
          onChange={(e) => setFiltroFechaBefore(e.target.value)}
        />
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
              </tr>
            </thead>
            <tbody>
              {reporteData.bitacoras_filtradas.map(bitacora => (
                <tr key={bitacora.id}>
                  <td>{bitacora.cliente}</td>
                  <td>{bitacora.fecha}</td>
                  <td>
                    <ul>
                      {bitacora.partidas.map(partida => (
                        <li key={partida.id}>{partida.cantidad} - {partida.descripcion} (${partida.costo})</li>
                      ))}
                    </ul>
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