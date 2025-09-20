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
  const { request } = useApi();

  // 🔹 Cargar todas las bitácoras
  const fetchBitacoras = async () => {
    const data = await request('bitacoras/', 'GET');
    if (data) setBitacoras(data);
  };

  useEffect(() => {
    fetchBitacoras();
  }, []);

  // 🔹 Guardar (crear o actualizar según corresponda)
  const handleSaveBitacora = async (bitacoraData: Bitacora | Omit<Bitacora, 'id'>) => {
    if ("id" in bitacoraData) {
      // Update
      await request(`bitacoras/${bitacoraData.id}/`, 'PUT', bitacoraData);
      setEditingId(null);
    } else {
      // Create
      await request('bitacoras/', 'POST', bitacoraData);
    }
    fetchBitacoras();
  };

  // 🔹 Eliminar
  const handleDeleteBitacora = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta bitácora?')) {
      const deleteAction = async () => {
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

  return (
    <>
      <div className="card create-form-card">
        <h2 className="title">Añadir Nueva Bitácora de Servicio</h2>
        <BitacoraForm onSave={handleSaveBitacora} />
      </div>

      <div className="card list-card">
        <h1 className="title">Bitácoras de Servicios</h1>
        <ul className="service-list">
          {bitacoras.map((bitacora) => (
            <li key={bitacora.id} className="service-item">
              {editingId === bitacora.id ? (
                <BitacoraForm
                  bitacoraExistente={bitacora}
                  onSave={handleSaveBitacora}
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
