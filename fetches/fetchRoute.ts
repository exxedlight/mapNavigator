import axios from "axios";
import Coordinates from "../interfaces/Coordinates";

export const fetchRoute = async (
    start: Coordinates, 
    end: Coordinates,
    setDistance: (distance: number | null) => void,
    setDuration: (duration: number | null) => void,
    setError: (error: string | null) => void
) => {
    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}`,
        {
          params: {
            overview: 'full', // whole way
            geometries: 'geojson', // response format
          },
        }
      );

      if (response.data && response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0].geometry.coordinates;

        setDistance(response.data.routes[0].distance);
        setDuration(response.data.routes[0].duration);

        return route.map(([lng, lat]: [number, number]) => [lat, lng]); // to LatLngExpression format
      } else {
        throw new Error('Маршрут не знайдено');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Помилка отримання маршруту: ${err.message}`);
      } else {
        setError('Невідома помилка отримання маршруту');
      }
      return null;
    }
  };