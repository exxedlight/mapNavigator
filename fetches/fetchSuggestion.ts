import axios from 'axios';
import { debounce } from 'lodash';

//  Отримує пропозиції ключових точок на основі введення користувача
export const fetchSuggestions = debounce(
  async (
    query: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (!query) {
      setter([]);
      return;
    }

    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          limit: 10, // Кількість варіантів
        },
        headers: {
          'Accept-Language': 'uk', // Українською мовою
        },
      });

      if (response.data && response.data.length > 0) {
        const names = response.data.map((item: any) => item.display_name);
        setter(names); // Зберігаємо адреси
      } else {
        setter([]); // Очистити список, ящо нічого не знайдено
      }
    } catch (err) {
      console.error('Помилка при отриманні пропозицій:', err);
      setter([]);
    }
  },
  300 // Задержка 300 мс для debounce
);