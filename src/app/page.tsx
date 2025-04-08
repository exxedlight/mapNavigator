"use client";
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { fetchRoute } from '../fetches/fetchRoute';
import { PageData } from '../interfaces/PageData';
import PointsContainer from '@/components/PointsContainer/PointsContainer';
import WaySearchPanel from '@/components/WaySearchPanel/WaySearchPanel';
import Header from '@/components/Header/Header';
import FunctionalButtons from '@/components/FunctionalButtons/FunctionalButtons';
const MapComponent = dynamic(() => import('@/components/MapComponent/MapComponent'), { ssr: false });


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
    isTrafficDrawed: false,
    isWeatherDrawed: false,
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



  return (
    <div className='wrapper'>
      <Header/>

      <p style={{ color: 'red' }} id='error-p'>{data.error ?? " "}</p>

      <WaySearchPanel
        data={data}
        setData={setData}
      />

      
<FunctionalButtons
    data={data}
    setData={setData}
  /> 



      {data.distance != null && data.duration != null && (
        <div className='way-info'>
          <label>Відстань: <p>{(data.distance! / 1000).toFixed(2)} км</p></label>
          <label>Час: <p>{Math.floor(data.duration! / 60)} хв</p></label>
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