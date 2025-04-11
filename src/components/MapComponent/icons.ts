import L from "leaflet";

export const customIcon = new L.Icon({
    iconUrl: '/marker-icon.png',
    iconSize: [30, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

export const checkIcon = new L.Icon({
    iconUrl: '/destination-marker.png',
    iconSize: [30, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

export const endIcon = new L.Icon({
    iconUrl: '/end-marker.png',
    iconSize: [30,40],
    iconAnchor: [12,41],
    popupAnchor: [1,-34]
});

export const carIcon = new L.Icon({
    iconUrl: '/car-marker.png',
    iconSize: [30,40],
    iconAnchor: [12,41],
    popupAnchor: [1,-34]
});