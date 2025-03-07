export const getCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      if (!response.ok) {
        throw new Error(`Error al obtener países: ${response.status}`);
      }
      const data = await response.json();
      // Extraemos y ordenamos los nombres de los países
      const countryNames = data
        .map(country => country.name.common)
        .sort((a, b) => a.localeCompare(b));
      return countryNames;
    } catch (error) {
      console.error('Error en getCountries:', error);
      throw error;
    }
  };
  