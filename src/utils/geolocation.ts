// The coordinates for the target location (e.g., the workplace)
const APPROVED_LOCATIONS = [
  { lat: -33.933441524533194, lon: 18.46671777285557 },
  { lat: -34.010195862993506, lon: 18.462161989876357 },
];
const ALLOWED_RADIUS_METERS = 100; // 100 meters

/**
 * Calculates the distance between two geographical coordinates using the Haversine formula.
 * @param lat1 Latitude of the first point
 * @param lon1 Longitude of the first point
 * @param lat2 Latitude of the second point
 * @param lon2 Longitude of the second point
 * @returns The distance in meters.
 */
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
}

/**
 * Checks if the user's current coordinates are within the allowed radius of any approved location.
 * @param userCoords The user's current coordinates.
 * @returns True if the user is within the allowed radius, false otherwise.
 */
export function isWithinGeofence(userCoords: GeolocationCoordinates): boolean {
  if (!userCoords) {
    return false;
  }

  // Check if the user is within the radius of ANY of the approved locations
  return APPROVED_LOCATIONS.some(location => {
    const distance = getDistance(
      userCoords.latitude,
      userCoords.longitude,
      location.lat,
      location.lon
    );
    return distance <= ALLOWED_RADIUS_METERS;
  });
}
