// src/utils/mapUtils.js

// Haversine distance
export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Fetch nearby places (wrapped to reuse)
export function fetchNearbyPlaces(currentPosition, placeType) {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject('Google Maps not loaded');
      return;
    }
    const map = new window.google.maps.Map(document.createElement('div'));
    const service = new window.google.maps.places.PlacesService(map);

    service.nearbySearch(
      {
        location: currentPosition,
        radius: 5000,
        type: placeType,
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          reject(status);
        }
      }
    );
  });
}

export function getPlaceDetails(placeId) {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject('Google Maps not loaded');
      return;
    }

    const map = new window.google.maps.Map(document.createElement('div'));
    const service = new window.google.maps.places.PlacesService(map);

    service.getDetails({ placeId }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        resolve(place);
      } else {
        reject('Place details failed: ' + status);
      }
    });
  });
}
