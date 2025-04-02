"use client";
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
//import MapComponent from '../../components/MapComponent';
import Coordinates from '../../interfaces/Coordinates';
import { LatLngExpression } from 'leaflet';
import { fetchRoute } from '../../fetches/fetchRoute';
import WaySearchPanel from '../../components/WaySearchPanel';
import PointsContainer from '../../components/PointsContainer';

const MapComponent = dynamic(() => import('../../components/MapComponent'), { ssr: false });

const HomePage = () => {
  
  const [startCoordinates, setStartCoordinates] = useState<Coordinates | null>(null);
  const [endCoordinates, setEndCoordinates] = useState<Coordinates | null>(null);
  const [additionalPoints, setAdditionalPoints] = useState<Coordinates[]>([]);

  
  const [error, setError] = useState<string | null>(null);
  const [route, setRoute] = useState<LatLngExpression[] | null>(null);
  const [distance, setDistance] = useState<number | null>(0); // Расстояние в метрах
  const [duration, setDuration] = useState<number | null>(0); // Время в пути в секундах
  const [isDeviceGeoUsed, setIsDeviceGeoUsed] = useState(false);

  const handleMapDoubleClick = (coordinates: Coordinates) => {
    setAdditionalPoints((prevPoints) => [...prevPoints, coordinates]);
  };

  useEffect(() => {
    const buildRoute = async () => {
      if (startCoordinates && endCoordinates) {
        try {
          const allPoints = [
            startCoordinates,
            ...additionalPoints,
            endCoordinates,
          ];
    
          const route = await fetchRoute(allPoints, setDistance, setDuration, setError);
          if (route) {
            setRoute(route);
          }
        } catch (err) {
          setError(`Помилка при побудові маршруту: ${(err as Error).message}`);
        }
      }
    };

    buildRoute();
  }, [startCoordinates, endCoordinates, additionalPoints]);



  const handleGetCurrentLocation = () => {

    if(isDeviceGeoUsed){
      setIsDeviceGeoUsed(false);
      setRoute(null);
      setStartCoordinates(null);
      setEndCoordinates(null);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setStartCoordinates({ lat: latitude, lng: longitude });
          setIsDeviceGeoUsed(true);
        },
        (error) => {
          setError(`Помилка при отриманні геолокації: ${error.message}`);
        }
      );
    } else {
      setError('Геолокація не підтримується вашим браузером.');
    }
  };



  return (
    <div className='wrapper'>
      <h1>Пошук маршруту</h1>
      <p style={{ color: 'red' }} id='error-p'>{error ?? " "}</p>

      <WaySearchPanel
        setError={setError}
        setStartCoordinates={setStartCoordinates}
        setEndCoordinates={setEndCoordinates}
        isDeviceGeoUsed={isDeviceGeoUsed}
        />

      <img 
        className='use-my-geo-btn' 
        src='/use-geo.png' 
        onClick={handleGetCurrentLocation}
        style={{
          backgroundColor: isDeviceGeoUsed ? "green" : "white"
        }}
        />

      {distance != null && duration != null && (
        <div className='way-info'>
          <label>Дистанція: <p>{(distance! / 1000).toFixed(2)} км</p></label>
          <label>Час в дорозі: <p>{Math.floor(duration! / 60)} хв</p></label>
        </div>
      )}

      <PointsContainer
        points={additionalPoints}
        setPoints={setAdditionalPoints}
      />

      

      {startCoordinates || endCoordinates ? (
        <MapComponent
        start={startCoordinates}
        end={endCoordinates}
        route={route}
        onMapDoubleClick={handleMapDoubleClick} // Передаем функцию в MapComponent
      />
      ) : (
        <p className='map-container'>Введіть адреси для відображення карти.</p>
      )}
    </div>
  );
};

export default HomePage;