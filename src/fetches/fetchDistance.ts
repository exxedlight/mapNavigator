import Coordinates from "@/interfaces/Coordinates";
import axios from "axios";

export const fetchDistance = async (
    points: Coordinates[],
) => {
    try {
        
        const coordinates = points.map(({ lat, lng }) => `${lng},${lat}`).join(';');

        // Запрос к OSRM
        const response = await axios.get(
            `https://router.project-osrm.org/route/v1/driving/${coordinates}`,
            {
                params: {
                    overview: 'full',
                    geometries: 'geojson',
                },
            }
        );

        if (response.data && response.data.routes && response.data.routes.length > 0) {
            const route = response.data.routes[0].geometry.coordinates;

            return {
                distance: response.data.routes[0].distance,
                duration: response.data.routes[0].duration
            }
        } else {
            throw new Error('Маршрут не знайдено');
        }
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Помилка отримання маршруту: ${err.message}`);
        }
        else {
            throw new Error(`Невідома помилка отримання маршруту`);
        }
    }
};