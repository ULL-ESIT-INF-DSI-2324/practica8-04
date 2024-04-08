// Importamos el módulo request para realizar solicitudes HTTP
import request from 'request';

/**
 * Función que obtiene información meteorológica.
 * @param {string} location - Ubicación para consulta.
 * @param {Function} callback - Función de callback para manejar la respuesta o errores.
 */
export const weatherInfo = (location: string, callback: (
  err: string | undefined, data: request.Response | undefined) => void) => {
  // Construimos la URL para la API de Weatherstack
  const url = `http://api.weatherstack.com/current?access_key=35adcff9c0967d0b74a4f896dce5038c&query=${encodeURIComponent(location)}&units=m`;

  // Realizamos la solicitud a la API del clima
  request({url: url, json: true}, (error: Error, response) => {
    // Si ocurre un error en la solicitud, llamamos al callback con el error
    if (error) {
      callback(`Weatherstack API is not available: ${error.message}`, undefined);
    } 
    // Si la API devuelve un error, lo manejamos aquí
    else if (response.body.error) {
      callback(`Weatherstack API error: ${response.body.error.type}`, undefined);
    } 
    // En caso de éxito, pasamos los datos de respuesta al callback
    else {
      callback(undefined, response);
    }
  });
};

/**
 * Función que obtiene información de coordenadas.
 * @param {string} location - Ubicación para consulta.
 * @param {Function} callback - Función de callback para manejar la respuesta o errores.
 */
export const coordinatesInfo = (location: string, callback:(
  err: string | undefined, data: request.Response | undefined) => void) => {
  // URL para la API de geocodificación de Mapbox
  const url = `http://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=pk.eyJ1IjoicGFvbGFhc3R1ZGlsbG8iLCJhIjoiY2x1cWM4MHV5MGRrbDJrbGloMDQycWp3NSJ9.yh4Zx5YGERH1rCJkswyORQ&limit=1`;

  // Realizamos la solicitud a la API de Mapbox
  request({url: url, json: true}, (error: Error, response) => {
    // Manejo de errores de la solicitud
    if (error) {
      callback(`Mapbox API is not available: ${error.message}`, undefined);
    } 
    // Si la API no encuentra la ubicación, manejamos el error aquí
    else if (response.body.features.length === 0) {
      callback(`Mapbox API error: no location found`, undefined);
    } 
    // En caso de éxito, pasamos los datos de respuesta al callback
    else {
      callback(undefined, response);
    }
  });
};

// Uso de la función coordinatesInfo y encadenamiento con weatherInfo
coordinatesInfo(process.argv[2], (coordErr, coordData) => {
  if (coordErr) {
    // Manejo de errores de coordinatesInfo
    console.log(coordErr);
  } else if (coordData) {
    // Extracción de latitud y longitud de la respuesta
    const longitude: number = coordData.body.features[0].center[0];
    const latitude: number = coordData.body.features[0].center[1];
    
    // Llamamos a weatherInfo usando las coordenadas obtenidas
    weatherInfo(`${latitude},${longitude}`, (weatherErr, weatherData) => {
      if (weatherErr) {
        // Manejo de errores de weatherInfo
        console.log(weatherErr);
      } else if (weatherData) {
        // En caso de éxito, mostramos la información del clima
        console.log(`Currently, the temperature is ` +
          `${weatherData.body.current.temperature} degrees in ` +
          `${weatherData.body.location.name}`);
      }
    });
  }
});
