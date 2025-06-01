// src/context/GoogleMapsProvider.jsx
import React, { createContext, useContext } from 'react';
import { useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];
const GoogleMapsContext = createContext();

export const GoogleMapsProvider = ({ children }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => useContext(GoogleMapsContext);
