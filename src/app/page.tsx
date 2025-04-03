"use client";
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import Coordinates from '../../interfaces/Coordinates';
import { fetchRoute } from '../../fetches/fetchRoute';
import WaySearchPanel from '../../components/WaySearchPanel';
import PointsContainer from '../../components/PointsContainer';
import { PageData } from '../../interfaces/PageData';

const MapComponent = dynamic(() => import('../../components/MapComponent/MapComponent'), { ssr: false });

const HomePage = () => {

  const [data, setData] = useState<PageData>({
    startCoordinates: null,
    endCoordinates: null,
    additionalPoints: [],
    error: null,
    route: null,
    distance: 0,
    duration: 0,
    isDeviceGeoUsed: false,
    isTrafficDrawed: false
  });

  useEffect(() => {
    const buildRoute = async () => {
      if (data.startCoordinates && data.endCoordinates) {
        try {
          const allPoints = [
            data.startCoordinates,
            ...data.additionalPoints,
            data.endCoordinates,
          ];

          const route = await fetchRoute(allPoints, setData);
          if (route) {
            setData((prev) => ({
              ...prev,
              route: route
            }));
          }
        } catch (err) {
          setData((prev) => ({
            ...prev,
            error: `Помилка при побудові маршруту: ${(err as Error).message}`
          }));
        }
      }
    };

    buildRoute();
  }, [
    data.startCoordinates,
    data.endCoordinates,
    data.additionalPoints
  ]);



  const handleGetCurrentLocation = () => {

    if (data.isDeviceGeoUsed) {
      setData((prev) => ({
        ...prev,
        isDeviceGeoUsed: false,
        route: null,
        startCoordinates: null,
        endCoordinates: null,
        additionalPoints: []
      }));
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setData((prev) => ({
            ...prev,
            startCoordinates: { lat: latitude, lng: longitude },
            isDeviceGeoUsed: true
          }));
        },
        (error) => {
          setData((prev) => ({
            ...prev,
            error: `Помилка при отриманні геолокації: ${error.message}`
          }));
        }
      );
    } else {
      setData((prev) => ({
        ...prev,
        error: 'Геолокація не підтримується вашим браузером.'
      }));
    }
  };



  return (
    <div className='wrapper'>
      <h1>Пошук маршруту</h1>
      <p style={{ color: 'red' }} id='error-p'>{data.error ?? " "}</p>

      <WaySearchPanel
        data={data}
        setData={setData}
      />

      <img
        className='use-my-geo-btn'
        src='/use-geo.png'
        onClick={handleGetCurrentLocation}
        style={{ backgroundColor: data.isDeviceGeoUsed ? "green" : "white" }}
      />

      <div
        className='use-traffic-layer'
        style={{ backgroundColor: data.isTrafficDrawed ? "green" : "white" }}
        onClick={(e) => {
          setData((prev) => ({
            ...prev, isTrafficDrawed: !prev.isTrafficDrawed
          }))
        }}>
        <i
          className='bx bxs-traffic'
        />
      </div>



      {data.distance != null && data.duration != null && (
        <div className='way-info'>
          <label>Дистанція: <p>{(data.distance! / 1000).toFixed(2)} км</p></label>
          <label>Час в дорозі: <p>{Math.floor(data.duration! / 60)} хв</p></label>
        </div>
      )}

      <PointsContainer
        points={data.additionalPoints}
        setData={setData}
      />



      {data.startCoordinates || data.endCoordinates ? (
        <MapComponent
          data={data}
          setData={setData}
        />
      ) : (
        <p className='map-container'>Введіть адреси для відображення карти.</p>
      )}
    </div>
  );
};

export default HomePage;