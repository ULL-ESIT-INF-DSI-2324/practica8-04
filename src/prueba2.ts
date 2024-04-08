// Importamos el módulo request
import request from 'request';

/**
 * Función weatherInfo que obtiene información meteorológica.
 * @param {string} location - Ubicación para la cual se solicita el clima.
 * @param {Function} callback - Función de callback que maneja la respuesta o errores.
 */
const weatherInfo = (location: string, callback: (
  err: string | undefined, data: request.Response | undefined) => void) => {

  // Construimos la URL de la API con la ubicación proporcionada
  const url = `http://api.weatherstack.com/current?access_key=35adcff9c0967d0b74a4f896dce5038c&query=${encodeURIComponent(location)}&units=m`;

  // Realizamos la solicitud a la API del clima
  request({url: url, json: true}, (error: Error, response) => {
    // Manejo de errores: si hay un error en la solicitud, llamamos al callback con el mensaje de error
    if (error) {
      callback(`Weatherstack API is not available: ${error.message}`, undefined);
    } 
    // Manejo de errores específicos de la API
    else if (response.body.error) {
      callback(`Weatherstack API error: ${response.body.error.type}`, undefined);
    } 
    // En caso de éxito, llamamos al callback con los datos de la respuesta
    else {
      callback(undefined, response);
    }
  });
};

// Uso de la función weatherInfo
// Se proporciona el lugar y una función de callback que maneja la respuesta o errores
weatherInfo(process.argv[2], (err, data) => {
  if (err) {
    // Si hay un error, se muestra en consola
    console.log(err);
  } else if (data) {
    // En caso de éxito, se muestra el cuerpo de la respuesta
    console.log(data.body);
  }
});

