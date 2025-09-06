// Importamos las herramientas ('hooks') que necesitamos de la librería de React.
// useState: para crear "cajas" de memoria (estado) dentro de nuestro componente.
// useEffect: para ejecutar código cuando ocurren ciertos "efectos" (como cuando el componente se carga por primera vez).
import { useState, useEffect } from 'react';

// Importamos nuestro archivo de estilos CSS para que el componente lo pueda usar.
import './App.css';

// Importamos el componente del formulario para poder usarlo en esta pantalla.
import ServicioForm from './ServicioForm';

// Con TypeScript, definimos la "forma" exacta que tendrá un objeto de servicio.
// Esto nos ayuda a evitar errores, asegurando que cada servicio siempre tenga estos campos.
interface Servicio {
  id: number;
  cliente: string;
  fecha: string;
  cantidad: number;
  descripcion_servicio: string;
}

// Aquí empieza la definición de nuestro componente principal de la aplicación.
function App() {
  // Creamos una "caja" de estado llamada 'servicios' para guardar la lista que viene de la API.
  // Le decimos a TypeScript que esta caja contendrá una lista (array) de objetos 'Servicio'.
  // Inicialmente, la caja está vacía ([]).
  const [servicios, setServicios] = useState<Servicio[]>([]);

  // Usamos useEffect para ejecutar un bloque de código.
  // Como al final le pasamos un array vacío [], le decimos a React: "ejecuta esto solo UNA VEZ,
  // justo después de que el componente se dibuje en la pantalla por primera vez".
  useEffect(() => {
    fetchServicios(); // Llamamos a la función para que vaya a buscar los datos.
  }, []);

  // Definimos una función reutilizable para obtener los datos de la API.
  // La hacemos 'async' porque la llamada a la red puede tardar.
  const fetchServicios = async () => {
    try { // Intentamos ejecutar este bloque de código.
      
      // Hacemos la llamada (fetch) a la URL de nuestra API de Django.
      const response = await fetch('http://127.0.0.1:8000/api/servicios/');
      
      // Convertimos la respuesta de texto JSON a un objeto de JavaScript.
      const data = await response.json();
      
      // Guardamos los datos recibidos en nuestra "caja" de estado.
      setServicios(data);
    } catch (error) { // Si algo falla...
      
      // ...atrapamos el error y lo mostramos en la consola para poder depurarlo.
      console.error('Error al obtener los datos:', error);
    }
  };

  // Esta función se encarga de ENVIAR un nuevo servicio a la API de Django.
  // La pasaremos a nuestro componente de formulario.
  const handleGuardarServicio = async (nuevoServicio: Omit<Servicio, 'id'>) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/servicios/', {
        method: 'POST', // Especificamos que es una petición POST para CREAR un nuevo recurso.
        headers: {
          'Content-Type': 'application/json', // Le decimos al servidor que le estamos enviando datos en formato JSON.
          // Más adelante, aquí necesitaremos añadir el token de seguridad CSRF.
        },
        body: JSON.stringify(nuevoServicio) // Convertimos nuestro objeto de JavaScript a una cadena de texto JSON.
      });

      if (response.ok) { // Si la respuesta del servidor es exitosa (ej. código 201)...
        
        // ...volvemos a llamar a fetchServicios() para obtener la lista actualizada.
        // Esto hará que el nuevo servicio aparezca en la pantalla automáticamente.
        fetchServicios();
      } else {
        console.error('Error al guardar el servicio');
      }
    } catch (error) {
      console.error('Error de red al intentar guardar:', error);
    }
  };

  // La función 'return' define qué es lo que se va a dibujar en la pantalla (el HTML/JSX).
  return (
    <div className="app-container">
      
      {/* Usamos nuestro componente de formulario. */}
      {/* Le pasamos la función 'handleGuardarServicio' a través de una "prop" llamada 'onGuardar'. */}
      <ServicioForm onGuardar={handleGuardarServicio} />

      <div className="card">
        <h1 className="title">Bitácora de Servicios - React</h1>
        <ul className="service-list">
          {/* Aquí usamos .map() para recorrer cada 'servicio' en nuestra caja de estado */}
          {servicios.map((servicio) => (
            // Por cada servicio, creamos un elemento <li> en la lista.
            // La 'key' es un identificador único que React necesita para optimizar la lista.
            <li key={servicio.id} className="service-item">
              {/* Imprimimos los datos de cada servicio en las etiquetas HTML */}
              <h3 className="service-client">{servicio.cliente}</h3>
              <p className="service-meta">
                {servicio.fecha} - Cantidad: {servicio.cantidad}
              </p>
              <p className="service-description">{servicio.descripcion_servicio}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Exportamos nuestro componente 'App' para que pueda ser usado en otras partes de la aplicación.
export default App;