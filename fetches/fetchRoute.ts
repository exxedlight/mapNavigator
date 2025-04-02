import axios from "axios";
import Coordinates from "../interfaces/Coordinates";

export const fetchRoute = async (
    points: Coordinates[], // Массив точек (начальная, промежуточные, конечная)
    setDistance: (distance: number | null) => void,
    setDuration: (duration: number | null) => void,
    setError: (error: string | null) => void
) => {
    try {
        // Формируем строку координат для запроса
        const coordinates = points.map(({ lat, lng }) => `${lng},${lat}`).join(';');

        // Запрос к OSRM
        const response = await axios.get(
            `https://router.project-osrm.org/route/v1/driving/${coordinates}`,
            {
                params: {
                    overview: 'full', // Полный маршрут
                    geometries: 'geojson', // Формат ответа
                },
            }
        );

        // Проверяем, что маршрут существует
        if (response.data && response.data.routes && response.data.routes.length > 0) {
            const route = response.data.routes[0].geometry.coordinates;

            // Устанавливаем расстояние и время
            setDistance(response.data.routes[0].distance);
            setDuration(response.data.routes[0].duration);

            // Возвращаем маршрут в формате LatLngExpression
            return route.map(([lng, lat]: [number, number]) => [lat, lng]);
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