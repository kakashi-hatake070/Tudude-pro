// OpenStreetMap Nominatim Geocoding & HTML5 Live Geolocation Service

export interface GeocodedLocation {
  coords: [number, number]; // [lng, lat]
  address: string;
  city: string;
}

export interface PlaceSuggestion {
  label: string;
  coords: [number, number]; // [lng, lat]
  city?: string;
  type?: string;
}

// Get user's live physical GPS location
export const getLiveCurrentPosition = async (): Promise<GeocodedLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by your browser.'));
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lng = pos.coords.longitude;
        const lat = pos.coords.latitude;
        try {
          const addressInfo = await reverseGeocode(lng, lat);
          const result: GeocodedLocation = {
            coords: [lng, lat],
            address: addressInfo.address,
            city: addressInfo.city
          };
          // Cache in session storage
          sessionStorage.setItem('cs_live_location', JSON.stringify(result));
          resolve(result);
        } catch (e) {
          // If reverse geocode fails, return coordinates
          resolve({
            coords: [lng, lat],
            address: `Current Location (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`,
            city: 'Your City'
          });
        }
      },
      (err) => {
        reject(new Error(err.message || 'Unable to retrieve your location. Please check browser permissions.'));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};

// Search any place, city, colony, or street in real time
export const searchPlaces = async (query: string): Promise<PlaceSuggestion[]> => {
  if (!query || query.trim().length < 2) return [];

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en'
        }
      }
    );

    if (!res.ok) return [];
    const data = await res.json();

    return data.map((item: any) => {
      const city =
        item.address?.city ||
        item.address?.town ||
        item.address?.state_district ||
        item.address?.state ||
        '';

      return {
        label: item.display_name,
        coords: [parseFloat(item.lon), parseFloat(item.lat)] as [number, number],
        city,
        type: item.type
      };
    });
  } catch (err) {
    console.warn('Geocoding search failed:', err);
    return [];
  }
};

// Reverse geocode coordinates to street address
export const reverseGeocode = async (lng: number, lat: number): Promise<{ address: string; city: string }> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en'
        }
      }
    );

    if (!res.ok) throw new Error('Reverse geocoding error');
    const data = await res.json();

    const road = data.address?.road || data.address?.suburb || data.address?.neighbourhood || '';
    const city = data.address?.city || data.address?.town || data.address?.state_district || data.address?.state || 'Your City';
    const address = data.display_name || `${road}, ${city}`;

    return { address, city };
  } catch (err) {
    return {
      address: `Location (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`,
      city: 'Your City'
    };
  }
};
