// Importamos la función request del módulo http
import { request } from 'http';

// Definimos la URL de la API del clima
const url = 'http://api.weatherstack.com/current?access_key=aeb97bf5fbae1e796215bb0be875d548&query=28.48,-16.31&units=m';

// Creamos una solicitud HTTP usando la función request del módulo http
const req = request(url, (response) => {
  // Inicializamos una variable para almacenar los datos recibidos
  let data = '';

  // Manejador del evento 'data' que se activa cuando se reciben datos del servidor
  response.on('data', (chunk) => {
    // Concatenamos los fragmentos de datos recibidos
    data += chunk;
  });

  // Manejador del evento 'end' que se activa cuando se han recibido todos los datos
  response.on('end', () => {
    // Convertimos los datos recibidos en formato JSON a un objeto JavaScript
    const body = JSON.parse(data);
    // Mostramos el objeto en la consola
    console.log(body);
  });
});

// Manejador del evento 'error' para capturar y mostrar errores en la solicitud
req.on('error', (error) => {
  console.log(error.message);
});

// Finalizamos la solicitud. Esta línea es necesaria para enviar la solicitud al servidor
req.end();
