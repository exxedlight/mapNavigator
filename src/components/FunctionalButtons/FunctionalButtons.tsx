"use client";
import MapComponentProps from "@/interfaces/MapComponentProps";
import "./style.css";
import React from "react";

const FunctionalButtons = (
  { data, setData }: MapComponentProps
) => {

  const handleGetCurrentLocation = () => {

    if (data.isDeviceGeoUsed) {
      setData((prev) => ({
        ...prev,
        isDeviceGeoUsed: false,
        /*route: null,*/
        /*startCoordinates: null,
        endCoordinates: null,
        additionalPoints: []*/
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
    <>
      {/* LOCATION BUTTON */}
      <div
        className='use-my-geo-btn'
        onClick={handleGetCurrentLocation}
        style={{ backgroundColor: data.isDeviceGeoUsed ? "green" : "white" }}>
        <i
          className='bx bx-current-location'
        />
      </div>

      {/* TRAFFIC BUTTON */}
      <div className='use-traffic-layer'
        onClick={(e) => {
          setData((prev) => ({
            ...prev, isTrafficDrawed: !prev.isTrafficDrawed
          }))
        }}
        style={{ backgroundColor: data.isTrafficDrawed ? "green" : "white" }}
      >
        <i
          className='bx bxs-traffic'
        />
      </div>

      {/* WEATHER BUTTON */}
      <div className='use-weather-layer'
        style={{ backgroundColor: data.isWeatherDrawed ? "green" : "white" }}
        onClick={(e) => {
          setData((prev) => ({
            ...prev, isWeatherDrawed: !prev.isWeatherDrawed
          }))
        }}
      >
        <i
          className='bx bx-cloud-light-rain'
        />
      </div>
    </>
  );
}
export default FunctionalButtons;
