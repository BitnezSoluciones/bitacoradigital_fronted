// src/BitacoraForm.tsx

import { useState, useEffect } from 'react';
import type { Bitacora, Partida } from './types';
import { useAuth } from './context/AuthContext'; // 1. Importamos el hook de autenticación

interface BitacoraFormProps {
  onSave: (bitacora: Omit<Bitacora, 'id'> | Bitacora) => void;
  bitacoraExistente?: Bitacora;
  onCancel?: () => void;
}

export const BitacoraForm = ({ onSave, bitacoraExistente, onCancel }: BitacoraFormProps) => {
  const { user } = useAuth(); // 2. Obtenemos la información del usuario logueado
  
  const [cliente, setCliente] = useState('');
  const [fecha, setFecha] = useState('');
  // 3. Aseguramos que 'costo' sea parte del estado inicial de las partidas
  const [partidas, setPartidas] = useState<Partida[]>([{ cantidad: 1, descripcion: '', costo: 0 }]);

  useEffect(() => {
    if (bitacoraExistente) {
      setCliente(bitacoraExistente.cliente);
      setFecha(bitacoraExistente.fecha);
      // Nos aseguramos que las partidas existentes tengan un 'costo', o lo ponemos en 0.
      const partidasConCosto = bitacoraExistente.partidas.map(p => ({ ...p, costo: p.costo || 0 }));
      setPartidas(partidasConCosto);
    }
  }, [bitacoraExistente]);

  const handlePartidaChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const nuevasPartidas = [...partidas];
    const { name, value } = event.target;
    let valor: string | number = value;
    if (name === 'cantidad' || name === 'costo') {
      valor = parseFloat(value) || 0;
    }
    nuevasPartidas[index] = { ...nuevasPartidas[index], [name]: valor };
    setPartidas(nuevasPartidas);
  };

  const addPartida = () => {
    // 4. Las nuevas partidas también deben tener un costo inicial
    setPartidas([...partidas, { cantidad: 1, descripcion: '', costo: 0 }]);
  };

  const removePartida = (index: number) => {
    setPartidas(partidas.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const data = { cliente, fecha, partidas };

    if (bitacoraExistente) {
      onSave({ ...data, id: bitacoraExistente.id });
    } else {
      onSave(data);
      setCliente('');
      setFecha('');
      setPartidas([{ cantidad: 1, descripcion: '', costo: 0 }]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="service-form">
      <fieldset>
        <legend>{bitacoraExistente ? `Editando Bitácora de ${bitacoraExistente.cliente}` : 'Datos del Cliente'}</legend>
        <input type="text" placeholder="Nombre del Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} required />
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
      </fieldset>
      
      <fieldset>
        <legend>Partidas del Servicio</legend>
        {partidas.map((partida, index) => (
          <div key={partida.id || index} className="partida-item">
            <input type="number" name="cantidad" placeholder="Cant." value={partida.cantidad} onChange={(e) => handlePartidaChange(index, e)} required />
            <input type="text" name="descripcion" placeholder="Descripción de la partida" value={partida.descripcion} onChange={(e) => handlePartidaChange(index, e)} required />
            
            {/* --- 5. RENDERIZADO CONDICIONAL DEL CAMPO COSTO --- */}
            {/* Este input solo aparecerá si el usuario es 'staff' (administrador) */}
            {user && user.is_staff && (
              <input 
                type="number" 
                step="0.01" 
                name="costo" 
                placeholder="Costo" 
                value={partida.costo} 
                onChange={(e) => handlePartidaChange(index, e)} 
                required 
              />
            )}

            {partidas.length > 1 && <button type="button" onClick={() => removePartida(index)} className="remove-btn">&times;</button>}
          </div>
        ))}
        <button type="button" onClick={addPartida} className="add-btn">+ Añadir Partida</button>
      </fieldset>

      <div className="form-actions">
        {onCancel && <button type="button" onClick={onCancel} className="cancel-btn">Cancelar</button>}
        <button type="submit">{bitacoraExistente ? 'Actualizar' : 'Guardar'} Bitácora</button>
      </div>
    </form>
  );
};