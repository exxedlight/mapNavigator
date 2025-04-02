import Coordinates from "./Coordinates";

export default interface WaySearchComponentProps {
    setError: (error: string | null) => void;
    setStartCoordinates: React.Dispatch<React.SetStateAction<Coordinates | null>>;
    setEndCoordinates: React.Dispatch<React.SetStateAction<Coordinates | null>>;
    isDeviceGeoUsed: boolean;
  }