// src/BitacorasPage.tsx

import { useState, useEffect } from 'react';
import './App.css';
import { BitacoraForm } from './BitacoraForm';
import { BitacoraDisplay } from './BitacoraDisplay';
import { ModalPago } from './components/ModalPago';
import { useApi } from './hooks/useApi';
import type { Bitacora } from './types';

export const BitacorasPage = () => {
  const [bitacoras, setBitacoras] = useState<Bitacora[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalPagoOpen, setModalPagoOpen] = useState(false);
  const [bitacoraSeleccionada, setBitacoraSeleccionada] = useState<Bitacora | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { request, marcarComoPagado } = useApi();

  // 🔹 Verificar si el usuario es admin
  useEffect(() => {
    const checkAdmin = async () => {
      // ✅ ORDEN CORRECTO: endpoint, method
      const userData = await request('current_user/', 'GET');
      if (userData) {
        setIsAdmin(userData.is_staff);
      }
    };
    checkAdmin();
  }, []);

  // 🔹 Cargar todas las bitácoras
  const fetchBitacoras = async () => {
    // ✅ ORDEN CORRECTO: endpoint, method
    const data = await request('bitacoras/', 'GET');
    if (data) setBitacoras(data);
  };

  useEffect(() => {
    fetchBitacoras();
  }, []);

  // 🔹 Guardar (crear o actualizar según corresponda)
  const handleSaveBitacora = async (bitacoraData: Bitacora | Omit<Bitacora, 'id'>) => {
    if ("id" in bitacoraData) {
      // ✅ ORDEN CORRECTO: endpoint, method, body
      await request(`bitacoras/${bitacoraData.id}/`, 'PUT', bitacoraData);
      setEditingId(null);
    } else {
      // ✅ ORDEN CORRECTO: endpoint, method, body
      await request('bitacoras/', 'POST', bitacoraData);
    }
    fetchBitacoras();
  };

  // 🔹 Eliminar
  const handleDeleteBitacora = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta bitácora?')) {
      const deleteAction = async () => {
        // ✅ ORDEN CORRECTO: endpoint, method
        await request(`bitacoras/${id}/`, 'DELETE');
        fetchBitacoras();
      };
      deleteAction();
    }
  };

  // 🔹 Editar
  const handleEditClick = (bitacora: Bitacora) => {
    setEditingId(bitacora.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // 🔹 Abrir modal de pago
  const handleMarcarPagadoClick = (bitacora: Bitacora) => {
    setBitacoraSeleccionada(bitacora);
    setModalPagoOpen(true);
  };

  // 🔹 Confirmar pago
  const handleConfirmarPago = async (data: {
    metodo_pago: string;
    fecha_pago?: string;
    folio_factura?: string;
    notas_pago?: string;
  }) => {
    if (!bitacoraSeleccionada) return;
    
    await marcarComoPagado(bitacoraSeleccionada.id, data);
    setModalPagoOpen(false);
    setBitacoraSeleccionada(null);
    fetchBitacoras();
  };

  return (
    <>
      <div className="card create-form-card">
        <h2 className="title">Añadir Nueva Bitácora de Servicio</h2>
        <BitacoraForm onSave={handleSaveBitacora} isAdmin={isAdmin} />
      </div>

      <div className="card list-card">
        <h1 className="title">Bitácoras de Servicios</h1>
        
        {/* Resumen rápido solo para admin */}
        {isAdmin && bitacoras.length > 0 && (
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>Total Bitácoras</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {bitacoras.length}
              </p>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>Pendientes</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#ffc107' }}>
                {bitacoras.filter(b => b.estado_pago === 'pendiente').length}
              </p>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>Pagadas</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                {bitacoras.filter(b => b.estado_pago === 'pagado').length}
              </p>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>Vencidas</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#dc3545' }}>
                {bitacoras.filter(b => b.esta_vencido).length}
              </p>
            </div>
          </div>
        )}

        <ul className="service-list">
          {bitacoras.map((bitacora) => (
            <li key={bitacora.id} className="service-item">
              {editingId === bitacora.id ? (
                <BitacoraForm
                  bitacoraExistente={bitacora}
                  onSave={handleSaveBitacora}
                  onCancel={handleCancelEdit}
                  isAdmin={isAdmin}
                />
              ) : (
                <BitacoraDisplay
                  bitacora={bitacora}
                  onEdit={() => handleEditClick(bitacora)}
                  onDelete={() => handleDeleteBitacora(bitacora.id)}
                  onMarcarPagado={() => handleMarcarPagadoClick(bitacora)}
                  isAdmin={isAdmin}
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Modal de Pago */}
      {bitacoraSeleccionada && (
        <ModalPago
          bitacora={bitacoraSeleccionada}
          isOpen={modalPagoOpen}
          onClose={() => {
            setModalPagoOpen(false);
            setBitacoraSeleccionada(null);
          }}
          onConfirm={handleConfirmarPago}
        />
      )}
    </>
  );
};