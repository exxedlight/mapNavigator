import axios from "axios";
import Coordinates from "../interfaces/Coordinates";

// отримує координати введеної адреси з OSM
export const fetchCoordinates = async (
    address: string, 
    setter: React.Dispatch<React.SetStateAction<Coordinates | null>>, 
    setError: (error: string | null) => void
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
        setter({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        throw new Error('Адресу не знайдено');
      }
    } catch (err) {
      setError(`Помилка при отриманні координат: ${(err as Error).message}`);
    }
  };