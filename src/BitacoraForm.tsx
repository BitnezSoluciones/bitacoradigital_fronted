// src/BitacoraForm.tsx

import { useState, useEffect } from 'react';
import type { Bitacora, Partida } from './types';

interface BitacoraFormProps {
  onSave: (bitacora: Omit<Bitacora, 'id'> | Bitacora) => void | Promise<void>;
  bitacoraExistente?: Bitacora;
  onCancel?: () => void;
}

export const BitacoraForm = ({ onSave, bitacoraExistente, onCancel }: BitacoraFormProps) => {
  const [cliente, setCliente] = useState('');
  const [fecha, setFecha] = useState('');
  const [partidas, setPartidas] = useState<Partida[]>([{ cantidad: 1, descripcion: '' }]);
  const [loading, setLoading] = useState(false); // 🔹 nuevo estado

  useEffect(() => {
    if (bitacoraExistente) {
      setCliente(bitacoraExistente.cliente);
      setFecha(bitacoraExistente.fecha);
      setPartidas(bitacoraExistente.partidas);
    }
  }, [bitacoraExistente]);

  const handlePartidaChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const nuevasPartidas = [...partidas];
    const { name, value } = event.target;
    nuevasPartidas[index] = {
      ...nuevasPartidas[index],
      [name]: name === 'cantidad' ? parseInt(value) || 0 : value
    };
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
      const data = { cliente, fecha, partidas };

      if (bitacoraExistente) {
        await onSave({ ...data, id: bitacoraExistente.id });
      } else {
        await onSave(data);
        setCliente('');
        setFecha('');
        setPartidas([{ cantidad: 1, descripcion: '' }]);
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
