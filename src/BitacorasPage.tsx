// frontend/src/BitacorasPage.tsx

import { useState, useEffect } from 'react';
import './App.css';
import { BitacoraForm } from './BitacoraForm';
import { BitacoraDisplay } from './BitacoraDisplay';
import { useApi } from './hooks/useApi';
import type { Bitacora } from './types';

export const BitacorasPage = () => {
  const [bitacoras, setBitacoras] = useState<Bitacora[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { request } = useApi(); // Usamos la versión final del hook

  const fetchBitacoras = async () => {
    const data = await request('GET', 'bitacoras/');
    if (data) setBitacoras(data);
  };

  useEffect(() => {
    fetchBitacoras();
  }, []);

  // --- LÓGICA CRUD CON TIPOS Y LLAMADAS CORREGIDAS ---
  const handleCreateBitacora = async (bitacoraData: Omit<Bitacora, 'id'> | Bitacora) => {
    await request('POST', 'bitacoras/', bitacoraData);
    fetchBitacoras();
  };

  const handleUpdateBitacora = async (bitacoraData: Omit<Bitacora, 'id'> | Bitacora) => {
    if (!('id' in bitacoraData)) {
      return; // No se puede actualizar sin ID
    }
    await request('PUT', `bitacoras/${bitacoraData.id}/`, bitacoraData);
    setEditingId(null);
    fetchBitacoras();
  };

  const handleDeleteBitacora = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta bitácora?')) {
      const deleteAction = async () => {
        await request('DELETE', `bitacoras/${id}/`);
        fetchBitacoras();
      }
      deleteAction();
    }
  };

  const handleEditClick = (bitacora: Bitacora) => {
    setEditingId(bitacora.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <>
      <div className="card create-form-card">
        <h2 className="title">Añadir Nueva Bitácora de Servicio</h2>
        <BitacoraForm onSave={handleCreateBitacora} />
      </div>
      <div className="card list-card">
        <h1 className="title">Bitácoras de Servicios</h1>
        <ul className="service-list">
          {bitacoras.map((bitacora) => (
            <li key={bitacora.id} className="service-item">
              {editingId === bitacora.id ? (
                <BitacoraForm
                  bitacoraExistente={bitacora}
                  onSave={handleUpdateBitacora}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <BitacoraDisplay
                  bitacora={bitacora}
                  onEdit={() => handleEditClick(bitacora)}
                  onDelete={() => handleDeleteBitacora(bitacora.id)}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};