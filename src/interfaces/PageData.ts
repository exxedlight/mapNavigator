import { LatLngExpression } from "leaflet";
import Coordinates from "./Coordinates";

export interface PageData{
  startCoordinates: Coordinates | null;
  endCoordinates: Coordinates | null;
  targetDestination: Coordinates | null;
  additionalPoints: Coordinates[];
  error: string | null;
  route: LatLngExpression[] | null;
  distance: number | null;
  duration: number | null;
  isDeviceGeoUsed: boolean;
  isTrafficDrawed: boolean;
  isWeatherDrawed: boolean;
}