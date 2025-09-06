// src/ServicioForm.tsx
import { useState } from 'react';

// --- LÓGICA NUEVA ---
// Definimos las "props" que este componente espera recibir.
// Espera una función llamada 'onGuardar'.
interface ServicioFormProps {
  onGuardar: (nuevoServicio: any) => void;
}

function ServicioForm({ onGuardar }: ServicioFormProps) {
  const [cliente, setCliente] = useState('');
  const [fecha, setFecha] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (evento: React.FormEvent) => {
    evento.preventDefault();
    const nuevoServicio = {
      cliente,
      fecha,
      cantidad: Number(cantidad),
      descripcion_servicio: descripcion
    };
    
    // Ahora, en lugar de un console.log, llamamos a la función que recibimos por props.
    onGuardar(nuevoServicio);

    // Limpiamos el formulario después de enviar
    setCliente('');
    setFecha('');
    setCantidad('');
    setDescripcion('');
  };
  
  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2 className="title">Registrar Nuevo Servicio</h2>

      <div className="form-group">
        {/* Añadimos className="form-label" */}
        <label className="form-label">Cliente:</label>
        {/* Añadimos className="form-input" */}
        <input 
          type="text" 
          className="form-input"
          value={cliente} 
          onChange={(e) => setCliente(e.target.value)} 
          required 
        />
      </div>

      <div className="form-group">
        <label className="form-label">Fecha:</label>
        <input 
          type="date" 
          className="form-input"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Cantidad:</label>
        <input 
          type="number" 
          className="form-input"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Descripción:</label>
        <textarea 
          className="form-input"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
      </div>
      
      <button type="submit" className="button-primary">
        Guardar Servicio
      </button>
    </form>
  );
}

export default ServicioForm;