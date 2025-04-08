import L from "leaflet";

export const customIcon = new L.Icon({
    iconUrl: '/marker-icon.png',
    iconSize: [30, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

export const destinationIcon = new L.Icon({
    iconUrl: '/destination-marker.png',
    iconSize: [30, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});