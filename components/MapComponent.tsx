"use client";
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapComponentProps from '../interfaces/MapComponentProps';
import Coordinates from '../interfaces/Coordinates';

const MapComponent: React.FC<MapComponentProps> = ({ start, end, route, onMapDoubleClick }) => {
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

  const defaultCenter: Coordinates = { lat: 50.27, lng: 30.31 };
  const center = start || defaultCenter;

  // Создаем реф для карты
  const mapRef = useRef<L.Map | null>(null);

  // Эффект для добавления обработчика двойного клика
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;

      // Отключаем стандартное увеличение масштаба при двойном клике
      map.doubleClickZoom.disable();

      // Добавляем обработчик двойного клика
      map.on('dblclick', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onMapDoubleClick({ lat, lng });
      });

      // Возвращаем функцию очистки для удаления обработчика
      return () => {
        map.off('dblclick');
        map.doubleClickZoom.enable(); // Восстанавливаем стандартное поведение при размонтировании
      };
    }
  }, [onMapDoubleClick]);

  if(typeof window == 'undefined'){
    return (
      <></>
    )
  }

  return (
    <MapContainer
      ref={(map) => {
        mapRef.current = map;
      }}
      center={center}
      zoom={13}
      className='map-container'
    >
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
      {route && <Polyline positions={route} color="blue" />}
    </MapContainer>
  );
};

export default MapComponent;