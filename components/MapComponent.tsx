// components/MapComponent.tsx
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapComponentProps from '../interfaces/MapComponentProps';
import Coordinates from '../interfaces/Coordinates';

//  Компонент мапи для сторінки
const MapComponent: React.FC<MapComponentProps> = ({ start, end, route }) => {
  const customIcon = new L.Icon({
    iconUrl: '/marker-icon.png',
    iconSize: [30, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const destinationIcon = new L.Icon({
    iconUrl: '/destination-marker.png',
    iconSize: [30, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  // Центр карти за замовчуванням (Київ)
  const defaultCenter: Coordinates = { lat: 50.27, lng: 30.31 };
  const center = start || defaultCenter;

  // Координати у формат LatLngExpression[]
  const linePositions = start && end ? [[start.lat, start.lng], [end.lat, end.lng]] : [];

  return (
    <MapContainer center={center} zoom={13} className='map-container'>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {start && (
        <Marker position={[start.lat, start.lng]} icon={customIcon}>
          <Popup>
            Точка старта
          </Popup>
        </Marker>
      )}
      {end && (
        <Marker position={[end.lat, end.lng]} icon={destinationIcon}>
          <Popup>
            Точка назначения
          </Popup>
        </Marker>
      )}

      {
        //  Пряма лінія від точки1 до точки2
        /*linePositions.length > 0 && <Polyline positions={linePositions as any} color="blue" />*/
      }

      {/* Маршрут (автомобільний) */}
      {route && <Polyline positions={route} color="blue" />}
    </MapContainer>
  );
};

export default MapComponent;