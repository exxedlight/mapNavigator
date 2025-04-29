import { LatLngExpression } from "leaflet";
import Coordinates from "./Coordinates";
import { Request } from "@/types/db";

export interface PageData{
  startCoordinates: Coordinates | null;
  endCoordinates: Coordinates | null;
  targetDestination: Coordinates | null;
  additionalPoints: Coordinates[];
  currentRequest: Request | null;
  error: string | null;
  route: LatLngExpression[] | null;
  distance: number | null;
  duration: number | null;
  isDeviceGeoUsed: boolean;
  isTrafficDrawed: boolean;
  isWeatherDrawed: boolean;
}