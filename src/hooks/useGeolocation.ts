import { useState, useEffect } from 'react';
import { isWithinGeofence } from '../utils/geolocation';

type GeolocationState = {
  loading: boolean;
  coordinates: GeolocationCoordinates | null;
  error: GeolocationPositionError | null;
  isWithinFence: boolean;
};

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    coordinates: null,
    error: null,
    isWithinFence: false,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      // Geolocation is not supported by this browser.
      // We can't use `new GeolocationPositionError` as it's not exposed.
      // So creating a compatible object.
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: {
          code: 2, // POSITION_UNAVAILABLE
          message: 'Geolocation is not supported by your browser',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        },
      }));
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      const withinFence = isWithinGeofence(position.coords);
      setState({
        loading: false,
        coordinates: position.coords,
        error: null,
        isWithinFence: withinFence,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setState({
        loading: false,
        coordinates: null,
        error,
        isWithinFence: false,
      });
    };

    // Request location
    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    // Optional: Set up a watcher to continuously track the user's position
    const watcher = navigator.geolocation.watchPosition(onSuccess, onError);

    // Cleanup watcher on component unmount
    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, []);

  return state;
}
