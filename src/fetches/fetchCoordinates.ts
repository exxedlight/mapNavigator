import axios from "axios";

// отримує координати введеної адреси з OSM
export const fetchCoordinates = async (
    address: string,
) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: address,
          format: 'json',
          limit: 1,
        },
      });
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];

        return { lat: parseFloat(lat), lng: parseFloat(lon) };
      } else {
        throw new Error('Адресу не знайдено');
      }
    } catch (err) {
      throw new Error(`Помилка при отриманні координат: ${(err as Error).message}`);
    }
  };