"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L, { icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "leaflet.vectorgrid";
import MapComponentProps from '@/interfaces/MapComponentProps';
import Coordinates from '@/interfaces/Coordinates';
import { tomTomApiKey } from '../../../keys';
import { carIcon, checkIcon, customIcon, endIcon } from './icons';
import "./style.css";

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
  let ignoreTap = false;

  const handleMapDoubleClick = (e: L.LeafletMouseEvent) => {
    setData((prevData) => ({
      ...prevData,
      additionalPoints: [...prevData.additionalPoints, e.latlng],
    }));
  }


  // TAP POINTS ADDING
  const attachTapHandler = (map: L.Map) => {
    const container = map.getContainer();

    let touchStartTime = 0;
    let startX = 0;
    let startY = 0;

    const maxTapDuration = 300; // ms
    const maxMoveThreshold = 10; // px

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      const touch = e.touches[0];
      touchStartTime = Date.now();
      startX = touch.clientX;
      startY = touch.clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!mapRef.current || e.changedTouches.length !== 1 || ignoreTap) return;
  
      const touch = e.changedTouches[0];
      const duration = Date.now() - touchStartTime;
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      if (duration < maxTapDuration && distance < maxMoveThreshold) {
        const containerPoint = map.mouseEventToContainerPoint({
          clientX: touch.clientX,
          clientY: touch.clientY,
        } as MouseEvent);

        const latlng = map.containerPointToLatLng(containerPoint);
        ignoreTap = true;
        setData((prevData) => ({
          ...prevData,
          additionalPoints: [...prevData.additionalPoints, latlng],
        }));
        setTimeout(() => {
          ignoreTap = false;
        }, 300);
      }
    };

    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchend', onTouchEnd);

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);
    };
  };


  useEffect(() => {
    const checkMapReady = () => {
      const map = mapRef.current;
      if (!map) {
        setTimeout(checkMapReady, 100);
        return;
      }

      const onDblClick = (e: L.LeafletMouseEvent) => {
        if(ignoreTap) return;

        ignoreTap = true;
        handleMapDoubleClick(e);
        
        setTimeout(() => {
          ignoreTap = false;
        }, 300);
      };

      map.on('dblclick', onDblClick);
      const detachTapHandler = attachTapHandler(map);

      return () => {
        map.off('dblclick', onDblClick);
        detachTapHandler?.();
      };
    };

    const cleanup = checkMapReady();

    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);

  {/* ============================================
      ============      RENDER    ================
      ============================================ 
    */}

  if (typeof window == 'undefined' || !data || !data.startCoordinates) {
    return <></>;
  }


  return (
    <MapContainer
      ref={(map) => { mapRef.current = map; }}
      center={data.startCoordinates}
      zoom={13}
      className='map-container'
      doubleClickZoom={false}
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
        className='main-map'
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
        <Marker key={i} position={[point.lat, point.lng]} icon={checkIcon}>
          <Popup>
            Проміжна точка
          </Popup>
        </Marker>
      ))}
      {data.targetDestination && (
        <Marker position={[data.targetDestination.lat, data.targetDestination.lng]} icon={carIcon}>
          <Popup>
            Авто для евакуації
          </Popup>
        </Marker>
      )}
      {data.endCoordinates && (
        <Marker position={[data.endCoordinates.lat, data.endCoordinates.lng]} icon={endIcon}>
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