"use client";
import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapComponentProps from '../../interfaces/MapComponentProps';
import Coordinates from '../../interfaces/Coordinates';
import { tomTomApiKey } from '../../keys';

const MapComponent = (
  { data, setData }: MapComponentProps
) => {
  {
    /* 
    ==============  ICONS 
    */
  }
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



  {
    /* 
    ====================  VARIABLES 
    */
  }
  const defaultCenter: Coordinates = { lat: 50.27, lng: 30.31 };
  //const [center, setCenter] = useState<LatLngExpression | undefined>(defaultCenter);

  const mapRef = useRef<L.Map | null>(null);


  const handleMapDoubleClick = (coordinates: Coordinates) => {
    setData((prevData) => ({
      ...prevData,
      additionalPoints: [...prevData.additionalPoints, coordinates],
    }));
  };

  useEffect(() => {
    if (mapRef.current && data.startCoordinates) {
      mapRef.current.setView(data.startCoordinates, 13);
    }
  }, [data.startCoordinates]);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;

      map.doubleClickZoom.disable();

      map.on('dblclick', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        handleMapDoubleClick({lat,lng});
      });

      return () => {
        map.off('dblclick');
        map.doubleClickZoom.enable();
      };
    }
  }, [handleMapDoubleClick]);


  {
    /* 
      ============  RENDER  ====================== 
    */
  }

  if (typeof window == 'undefined' || !data) {
    return (
      <></>
    )
  }


  return (
    <MapContainer
      ref={(map) => {
        mapRef.current = map;
      }}
      center={data.startCoordinates || defaultCenter}
      zoom={13}
      className='map-container'
    >
      {/* LAYERS */}
      {/* OSM MAP */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* TomTom Traffic */}
      {data.isTrafficDrawed && (
        <TileLayer
        url={`https://api.tomtom.com/traffic/map/4/tile/flow/relative/{z}/{x}/{y}.png?key=${tomTomApiKey}`}
        opacity={0.7} // Прозрачность слоя
        attribution="Traffic data © TomTom"
      />
      )}
      

      {data.startCoordinates && (
        <Marker position={[data.startCoordinates.lat, data.startCoordinates.lng]} icon={customIcon}>
          <Popup>
            Точка старту
          </Popup>
        </Marker>
      )}
      {data.endCoordinates && (
        <Marker position={[data.endCoordinates.lat, data.endCoordinates.lng]} icon={destinationIcon}>
          <Popup>
            Точка призначення
          </Popup>
        </Marker>
      )}
      {data.route && <Polyline positions={data.route} color="blue" />}
    </MapContainer>
  );
};

export default MapComponent;