export const getCountries = async () => {
  try {
    // Se hace la petición para obtener todos los países
    const response = await fetch('https://restcountries.com/v3.1/all');

    // Si la respuesta no es exitosa, lanza un error
    if (!response.ok) {
      throw new Error(`Error al obtener países: ${response.status}`);
    }

    // Convierte la respuesta a JSON
    const data = await response.json();

    // Extrae y ordena alfabéticamente los nombres de los países
    const countryNames = data
      .map(country => country.name.common)
      .sort((a, b) => a.localeCompare(b));

    // Retorna la lista de nombres de países
    return countryNames;
  } catch (error) {
    // Muestra el error en consola y lo lanza
    console.error('Error en getCountries:', error);
    throw error;
  }
};
