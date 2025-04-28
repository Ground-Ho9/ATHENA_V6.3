// utils/locationUtils.js
export async function geocodeAddress(address) {
  const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with real key
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
  console.warn("Geocoding failed:", data.status);
}
      return null;
    }
  } catch (error) {
if (__DEV__) {
}
    return null;
  }
}
