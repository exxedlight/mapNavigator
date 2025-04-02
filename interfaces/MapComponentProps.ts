import { LatLngExpression } from "leaflet";
import Coordinates from "./Coordinates";

export default interface MapComponentProps{
    start: Coordinates | null;
    end: Coordinates | null;
    route: LatLngExpression[] | null;   //  автомобільний маршрут
    onMapDoubleClick: (coordinates: Coordinates) => void;
}