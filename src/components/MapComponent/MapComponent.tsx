"use client";
import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "leaflet.vectorgrid";
import MapComponentProps from '@/interfaces/MapComponentProps';
import Coordinates from '@/interfaces/Coordinates';
import { tomTomApiKey } from '../../../keys';
import { customIcon, destinationIcon } from './icons';

const MapComponent = (
  { data, setData }: MapComponentProps
) => {

  /*  
      ========================================
      ============  VARIABLES  ===============
      ========================================
  */

  const defaultCenter: Coordinates = { lat: 50.27, lng: 30.31 };
  const mapRef = useRef<L.Map | null>(null);
  const weatherRef = useRef<any>(null);

  const handleMapDoubleClick = (coordinates: Coordinates) => {
    setData((prevData) => ({
      ...prevData,
      additionalPoints: [...prevData.additionalPoints, coordinates],
    }));
  };

  {/* LOAD MAP */}
  useEffect(() => {
    if (mapRef.current && data.startCoordinates) {
      mapRef.current.setView(data.startCoordinates, 13);
    }
  }, [data.startCoordinates]);

  {/* DOUBLE CLICK */ }
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;

      map.doubleClickZoom.disable();

      map.on('dblclick', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        handleMapDoubleClick({ lat, lng });
      });


      return () => {
        map.off('dblclick');
        map.doubleClickZoom.enable();
      };
    }
  }, [handleMapDoubleClick]);

  {/* TAP */ }
  useEffect(() => {
    if (!mapRef.current) return;
  
    const map = mapRef.current;
    const container = map.getContainer();
  
    let touchStartTime = 0;
    let startX = 0;
    let startY = 0;
  
    const maxTapDuration = 300; // мс
    const maxMoveThreshold = 10; // пикселей
  
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
  
      const touch = e.touches[0];
      touchStartTime = Date.now();
      startX = touch.clientX;
      startY = touch.clientY;
    };
  
    const onTouchEnd = (e: TouchEvent) => {
      if (!mapRef.current || e.changedTouches.length !== 1) return;
  
      const touch = e.changedTouches[0];
      const duration = Date.now() - touchStartTime;
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  
      if (duration < maxTapDuration && distance < maxMoveThreshold) {
        const containerPoint = mapRef.current.mouseEventToContainerPoint({
          clientX: touch.clientX,
          clientY: touch.clientY,
        } as MouseEvent);
  
        const latlng = mapRef.current.containerPointToLatLng(containerPoint);
        handleMapDoubleClick({ lat: latlng.lat, lng: latlng.lng });
      }
    };
  
    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchend', onTouchEnd);
  
    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleMapDoubleClick]);
  
  {/* WEATHER UPDATE */}
  /*useEffect(() => {
    // Интервал обновления в миллисекундах
    const updateInterval = 500; // 500 ms = 0.5 сек

    // Функция для обновления URL плитки
    const updateTileLayer = () => {
      if (weatherRef.current) {
        // Создаем новый URL с уникальной меткой времени для каждой загрузки
        const currentTimestamp = Date.now();
        const newUrl = `https://tilecache.rainviewer.com/v2/radar/nowcast_b3d71d1df9af/256/{z}/{x}/{y}/1/0_0.png?timestamp=${currentTimestamp}`;
        
        // Обновляем URL TileLayer
        weatherRef.current.setUrl(newUrl);
      }
    };

    // Настроим таймер для обновления
    const intervalId = setInterval(updateTileLayer, updateInterval);

    // Очистка таймера при удалении компонента
    return () => clearInterval(intervalId);
  }, []);*/

  {/* ============================================
      ============      RENDER    ================
      ============================================ 
    */}

  if (typeof window == 'undefined' || !data) {
    return (
      <></>
    )
  }


  return (
    <MapContainer
      ref={(map) => { mapRef.current = map; }}
      center={data.startCoordinates || defaultCenter}
      zoom={13}
      className='map-container'
      style={{touchAction: "manipulation"}}
    >

      { /*  ===================================== */
        /*  ===========               =========== */
        /* ============    LAYERS     =========== */
        /*  ===========               =========== */
        /*  ===================================== */}

      {/* OSM MAP - MAIN*/}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        opacity={1}
        attribution='OpenStreetMap'
      />

      {/* TomTom Traffic - Additional */}
      {data.isTrafficDrawed && (
        <TileLayer
          url={`https://api.tomtom.com/traffic/map/4/tile/flow/relative/{z}/{x}/{y}.png?key=${tomTomApiKey}`}
          opacity={.5}
          attribution="TomTom - Traffic data"
        />
      )}

      {data.isWeatherDrawed && (
        <TileLayer
          ref={weatherRef}
          url={`https://tilecache.rainviewer.com/v2/radar/nowcast_b3d71d1df9af/256/{z}/{x}/{y}/3/0_1.png`}
          /* 
            https://tilecache.rainviewer.com/v2/radar/ 
            [nowcast_b3d71d1df9af = forecast] / 
            [256-512 = size] / {z}/{x}/{y} / 
            [color schem] / 
            [(displaySmooth)_(showSnow).png]
          */
          opacity={.3}
          attribution='RainViewer API'
        />
      )}
      

      {/* ================================ */}
      {/* ==== MARKERS AND ROUTE LINE ==== */}
      {/* ================================ */}
      {data.startCoordinates && (
        <Marker position={[data.startCoordinates.lat, data.startCoordinates.lng]} icon={customIcon}>
          <Popup>
            Точка старту
          </Popup>
        </Marker>
      )}
      {data.additionalPoints && data.additionalPoints.map((point, i) => (
        <Marker key={i} position={[point.lat, point.lng]} icon={destinationIcon}>
          <Popup>
            Проміжна точка
          </Popup>
        </Marker>
      ))}
      {data.endCoordinates && (
        <Marker position={[data.endCoordinates.lat, data.endCoordinates.lng]} icon={destinationIcon}>
          <Popup>
            Точка призначення
          </Popup>
        </Marker>
      )}
      {data.route && <Polyline positions={data.route} color="rgba(0,0,255,.5)" />}
    </MapContainer>
  );
};

export default MapComponent;