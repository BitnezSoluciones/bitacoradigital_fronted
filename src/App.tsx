// frontend/src/App.tsx

import { useState, useEffect } from 'react';
import './App.css';
import { BitacoraForm } from './BitacoraForm';
import { BitacoraDisplay } from './BitacoraDisplay';
import { useApi } from './hooks/useApi';
import type { Bitacora } from './types';
import Navbar from './components/Navbar';


function App() {
  const [bitacoras, setBitacoras] = useState<Bitacora[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const api = useApi('bitacoras');

  const fetchBitacoras = async () => {
    const data = await api.get();
    if (data) setBitacoras(data);
  };

  useEffect(() => {
    fetchBitacoras();
  }, []);

  // --- LÓGICA CRUD CON TIPOS CORREGIDOS ---
  const handleCreateBitacora = async (bitacoraData: Omit<Bitacora, 'id'> | Bitacora) => {
    const result = await api.create(bitacoraData);
    if (result) fetchBitacoras();
  };

  const handleUpdateBitacora = async (bitacoraData: Omit<Bitacora, 'id'> | Bitacora) => {
    if (!('id' in bitacoraData)) {
      console.error("Se intentó actualizar una bitácora sin ID.");
      return;
    }
    const result = await api.update(bitacoraData.id, bitacoraData);
    if (result) {
      fetchBitacoras();
      setEditingId(null);
    }
  };

  const handleDeleteBitacora = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta bitácora?')) {
      const deleteAction = async () => {
        const result = await api.remove(id);
        if (result) fetchBitacoras();
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
    <Navbar />
    <div className="app-container">
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
    </div>
    </>
  );
}

export default App;