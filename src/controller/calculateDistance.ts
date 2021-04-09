const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

export const calculateDistance = (coordinates1: any, coordinates2: any) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(coordinates2.lat - coordinates1.lat); // deg2rad below
  const dLon = deg2rad(coordinates2.long - coordinates1.long); // deg2radlon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coordinates1.long)) *
      Math.cos(deg2rad(coordinates2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};
