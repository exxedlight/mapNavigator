import { LatLngExpression } from "leaflet";
import Coordinates from "./Coordinates";
import { PageData } from "./PageData";

export default interface MapComponentProps{
    data: PageData;
    setData: React.Dispatch<React.SetStateAction<PageData>>;
}