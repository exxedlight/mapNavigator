import Coordinates from "@/interfaces/Coordinates";
import { PageData } from "@/interfaces/PageData";
import axios from "axios";

export const fetchRoute = async (
    points: Coordinates[],
    setData: React.Dispatch<React.SetStateAction<PageData>>,
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

            setData((prev) => ({
                ...prev,
                distance: response.data.routes[0].distance,
                duration: response.data.routes[0].duration
            }))
            
            return route.map(([lng, lat]: [number, number]) => [lat, lng]);
        } else {
            throw new Error('Маршрут не знайдено');
        }
    } catch (err) {
        if (err instanceof Error) {
            setData((prev) => ({
                ...prev,
                error: `Помилка отримання маршруту: ${err.message}`
            }));
        } else {
            setData((prev) => ({
                ...prev,
                error: 'Невідома помилка отримання маршруту'
            }));
        }
        return null;
    }
};