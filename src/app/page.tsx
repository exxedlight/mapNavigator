"use client";
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { fetchRoute } from '../fetches/fetchRoute';
import { PageData } from '../interfaces/PageData';
import PointsContainer from '@/components/PointsContainer/PointsContainer';
import WaySearchPanel from '@/components/WaySearchPanel/WaySearchPanel';
import Header from '@/components/Header/Header';
import FunctionalButtons from '@/components/FunctionalButtons/FunctionalButtons';
import { Roles } from '@/types/db';
import SosButton from '@/components/SosButton/SosButton';
import DriverRequests from '@/components/DriverRequests/DriverRequests';
const MapComponent = dynamic(() => import('@/components/MapComponent/MapComponent'), { ssr: false });


const HomePage = () => {

  const [data, setData] = useState<PageData>({
    startCoordinates: null,
    endCoordinates: null,
    targetDestination: null,
    additionalPoints: [],
    error: null,
    route: null,
    currentRequest: null,
    distance: 0,
    duration: 0,
    isDeviceGeoUsed: false,
    isTrafficDrawed: false,
    isWeatherDrawed: false,
  });

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<number | undefined>(undefined);

  useEffect(() => {
    const buildRoute = async () => {
      if (data.startCoordinates && (data.endCoordinates || data.additionalPoints.length > 0)) {
        try {
          let allPoints = [];


          if(data.endCoordinates && data.targetDestination){
            allPoints = [
              data.startCoordinates,
              ...data.additionalPoints,
              data.targetDestination,
              data.endCoordinates,
            ];
          }
          else if (data.endCoordinates) {
            allPoints = [
              data.startCoordinates,
              ...data.additionalPoints,
              data.endCoordinates,
            ];
          }
          else {
            allPoints = [
              data.startCoordinates,
              ...data.additionalPoints
            ]
          }

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

  const loadCurrentRequestIfExists = () => {
    const currentReqString = localStorage.getItem("current_req");
    if (currentReqString) {
        try {
            const currentReq = JSON.parse(currentReqString);
            setData((prev) => ({
                ...prev,
                currentRequest: currentReq,
            }));
            alert(123);
        } catch (error) {
            console.error("Failed to parse current request from localStorage:", error);
        }
    }
};

  useEffect(() => {
    if (isLoggedIn && localStorage.getItem("user_role")) {
      setUserRole(Number.parseInt(localStorage.getItem("user_role") as string));
      loadCurrentRequestIfExists();
    }
  }, [isLoggedIn]);

  return (
    <div className='wrapper'>
      <Header
        loggedIn={isLoggedIn}
        setLoggedIn={setLoggedIn}
      />

      <p style={{ color: 'red' }} id='error-p'>{data.error ?? " "}</p>

      <WaySearchPanel
        data={data}
        setData={setData}
      />

      <FunctionalButtons
        data={data}
        setData={setData}
      />

      {userRole == Roles.user && (
        <SosButton
          userData={data}
        />
      )}
      {userRole == Roles.driver && data.startCoordinates && (
        <DriverRequests
          data={data}
          setData={setData}
        />
      )}

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

      {data.startCoordinates ? (
        <MapComponent
          data={data}
          setData={setData}
        />
      ) : (
        <p
          className='map-container'
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "90vh",
            textDecoration: "underline"
          }}
        >
          Введіть адреси для відображення карти.
        </p>
      )}
    </div>
  );
};

export default HomePage;