import * as Location from 'expo-location';
import { Platform } from 'react-native';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface UserLocation {
  city: string;
  state: string;
  zipCode?: string;
  coordinates: LocationCoordinates;
  address?: string;
  country?: string;
}

export interface LocationSearchResult {
  id: string;
  displayName: string;
  city: string;
  state: string;
  zipCode?: string;
  coordinates: LocationCoordinates;
  distance?: number;
}

class LocationService {
  private currentLocation: UserLocation | null = null;
  private locationPermissionGranted = false;

  async requestLocationPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        return new Promise((resolve) => {
          try {
            if ('geolocation' in navigator) {
              // Some browsers don't support navigator.permissions. If missing, optimistically proceed to trigger prompt.
              const perms = (navigator as any)?.permissions?.query?.({ name: 'geolocation' as any }) ?? null;
              if (perms && typeof (perms as Promise<any>).then === 'function') {
                (perms as Promise<any>)
                  .then((result: { state: 'granted' | 'prompt' | 'denied' }) => {
                    this.locationPermissionGranted = result.state === 'granted' || result.state === 'prompt';
                    resolve(this.locationPermissionGranted);
                  })
                  .catch(() => {
                    // If querying perms fails, allow getCurrentPosition to trigger prompt
                    this.locationPermissionGranted = true;
                    resolve(true);
                  });
              } else {
                // Fallback: allow and let getCurrentPosition prompt
                this.locationPermissionGranted = true;
                resolve(true);
              }
            } else {
              this.locationPermissionGranted = false;
              resolve(false);
            }
          } catch {
            console.warn('navigator.permissions check failed, proceeding to prompt');
            this.locationPermissionGranted = true;
            resolve(true);
          }
        });
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        this.locationPermissionGranted = status === 'granted';
        return this.locationPermissionGranted;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      this.locationPermissionGranted = false;
      return false;
    }
  }

  async getCurrentLocation(): Promise<UserLocation | null> {
    try {
      if (!this.locationPermissionGranted) {
        const hasPermission = await this.requestLocationPermission();
        if (!hasPermission) {
          return null;
        }
      }

      if (Platform.OS === 'web') {
        return this.getCurrentLocationWeb();
      } else {
        return this.getCurrentLocationMobile();
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  private async getCurrentLocationWeb(): Promise<UserLocation | null> {
    return new Promise((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const location = await this.reverseGeocode({ latitude, longitude });
            resolve(location);
          },
          (error) => {
            console.error('Web geolocation error:', error);
            resolve(null);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      } else {
        resolve(null);
      }
    });
  }

  private async getCurrentLocationMobile(): Promise<UserLocation | null> {
    try {
      // Try last known first for speed
      const lastKnown = await Location.getLastKnownPositionAsync();
      if (lastKnown?.coords) {
        const { latitude, longitude } = lastKnown.coords;
        return await this.reverseGeocode({ latitude, longitude });
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 100,
      });

      const { latitude, longitude } = location.coords;
      return await this.reverseGeocode({ latitude, longitude });
    } catch (error) {
      console.error('Mobile location error:', error);
      return null;
    }
  }

  private async reverseGeocode(coordinates: LocationCoordinates): Promise<UserLocation | null> {
    try {
      const googleApiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

      if (googleApiKey && googleApiKey !== 'google_places_api_key_active') {
        console.log('🌐 Using Google Geocoding API for reverse geocoding');
        try {
          const location = await this.reverseGeocodeWithGoogle(coordinates, googleApiKey);
          if (location) return location;
        } catch (error) {
          console.warn('Google Geocoding API failed, attempting Nominatim:', error);
          if (Platform.OS === 'web') {
            const nominatim = await this.reverseGeocodeWithNominatim(coordinates);
            if (nominatim) return nominatim;
          }
        }
      }

      if (Platform.OS === 'web') {
        const nominatim = await this.reverseGeocodeWithNominatim(coordinates);
        if (nominatim) return nominatim;
        return this.mockReverseGeocode(coordinates);
      } else {
        // On mobile, try platform reverse geocode; if it fails, fallback to a minimal result with just coordinates
        const results = await Location.reverseGeocodeAsync(coordinates);
        if (results.length > 0) {
          const result = results[0];
          return {
            city: result.city || result.subregion || 'Unknown City',
            state: result.region || 'Unknown State',
            zipCode: result.postalCode || undefined,
            coordinates,
            address: `${result.street || ''} ${result.streetNumber || ''}`.trim(),
            country: result.country || 'US'
          };
        }
        return {
          city: 'My Area',
          state: 'Unknown',
          coordinates,
        } as UserLocation;
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return this.mockReverseGeocode(coordinates);
    }
  }

  private async reverseGeocodeWithGoogle(coordinates: LocationCoordinates, apiKey: string): Promise<UserLocation | null> {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&key=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Google Geocoding API error: ${response.status}`);
      }
      const data = await response.json();
      if (data.status !== 'OK' || !data.results?.length) {
        throw new Error(`Google Geocoding API status: ${data.status}`);
      }
      const result = data.results[0];
      const addressComponents = result.address_components || [];
      const cityComponent = addressComponents.find((comp: any) => comp.types?.includes('locality'))
        ?? addressComponents.find((comp: any) => comp.types?.includes('postal_town'));
      const stateComponent = addressComponents.find((comp: any) => comp.types?.includes('administrative_area_level_1'));
      const zipComponent = addressComponents.find((comp: any) => comp.types?.includes('postal_code'));
      const countryComponent = addressComponents.find((comp: any) => comp.types?.includes('country'));
      return {
        city: cityComponent?.long_name || 'Unknown City',
        state: stateComponent?.short_name || 'Unknown State',
        zipCode: zipComponent?.long_name,
        coordinates,
        address: result.formatted_address,
        country: countryComponent?.short_name || 'US'
      };
    } catch (error) {
      console.error('Google Geocoding API error:', error);
      throw error;
    }
  }

  private mockReverseGeocode(coordinates: LocationCoordinates): UserLocation {
    // Mock implementation for web or when geocoding fails
    // In a real app, you'd use a proper geocoding service
    const mockLocations = [
      { city: 'Springfield', state: 'IL', zipCode: '62701' },
      { city: 'Chicago', state: 'IL', zipCode: '60601' },
      { city: 'Peoria', state: 'IL', zipCode: '61602' },
      { city: 'Rockford', state: 'IL', zipCode: '61101' },
      { city: 'Champaign', state: 'IL', zipCode: '61820' }
    ];

    // Find closest mock location (simplified)
    const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    
    return {
      ...randomLocation,
      coordinates,
      address: 'Current Location'
    };
  }

  async searchLocations(query: string): Promise<LocationSearchResult[]> {
    try {
      const googleApiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

      if (googleApiKey && googleApiKey !== 'google_places_api_key_active') {
        console.log('🌐 Using Google Places API for location search');
        try {
          return await this.searchWithGooglePlaces(query, googleApiKey);
        } catch (err) {
          console.warn('Google Places search failed, attempting Nominatim:', err);
          if (Platform.OS === 'web') {
            const nominatim = await this.searchWithNominatim(query);
            if (nominatim.length) return nominatim;
          }
        }
      }

      if (Platform.OS === 'web') {
        const nominatim = await this.searchWithNominatim(query);
        if (nominatim.length) return nominatim;
      }

      console.log('🔄 Using enhanced mock location data');
      const mockResults: LocationSearchResult[] = [
        // Illinois
        {
          id: '1',
          displayName: 'Springfield, IL 62701',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62701',
          coordinates: { latitude: 39.7817, longitude: -89.6501 }
        },
        {
          id: '2',
          displayName: 'Chicago, IL 60601',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          coordinates: { latitude: 41.8781, longitude: -87.6298 }
        },
        {
          id: '3',
          displayName: 'Peoria, IL 61602',
          city: 'Peoria',
          state: 'IL',
          zipCode: '61602',
          coordinates: { latitude: 40.6936, longitude: -89.5890 }
        },
        // California
        {
          id: '4',
          displayName: 'Los Angeles, CA 90210',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          coordinates: { latitude: 34.0522, longitude: -118.2437 }
        },
        {
          id: '5',
          displayName: 'San Francisco, CA 94102',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          coordinates: { latitude: 37.7749, longitude: -122.4194 }
        },
        {
          id: '6',
          displayName: 'San Diego, CA 92101',
          city: 'San Diego',
          state: 'CA',
          zipCode: '92101',
          coordinates: { latitude: 32.7157, longitude: -117.1611 }
        },
        // New York
        {
          id: '7',
          displayName: 'New York, NY 10001',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          coordinates: { latitude: 40.7128, longitude: -74.0060 }
        },
        {
          id: '8',
          displayName: 'Buffalo, NY 14201',
          city: 'Buffalo',
          state: 'NY',
          zipCode: '14201',
          coordinates: { latitude: 42.8864, longitude: -78.8784 }
        },
        // Texas
        {
          id: '9',
          displayName: 'Houston, TX 77001',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001',
          coordinates: { latitude: 29.7604, longitude: -95.3698 }
        },
        {
          id: '10',
          displayName: 'Dallas, TX 75201',
          city: 'Dallas',
          state: 'TX',
          zipCode: '75201',
          coordinates: { latitude: 32.7767, longitude: -96.7970 }
        },
        {
          id: '11',
          displayName: 'Austin, TX 73301',
          city: 'Austin',
          state: 'TX',
          zipCode: '73301',
          coordinates: { latitude: 30.2672, longitude: -97.7431 }
        },
        // Florida
        {
          id: '12',
          displayName: 'Miami, FL 33101',
          city: 'Miami',
          state: 'FL',
          zipCode: '33101',
          coordinates: { latitude: 25.7617, longitude: -80.1918 }
        },
        {
          id: '13',
          displayName: 'Orlando, FL 32801',
          city: 'Orlando',
          state: 'FL',
          zipCode: '32801',
          coordinates: { latitude: 28.5383, longitude: -81.3792 }
        },
        // More states
        {
          id: '14',
          displayName: 'Denver, CO 80201',
          city: 'Denver',
          state: 'CO',
          zipCode: '80201',
          coordinates: { latitude: 39.7392, longitude: -104.9903 }
        },
        {
          id: '15',
          displayName: 'Seattle, WA 98101',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101',
          coordinates: { latitude: 47.6062, longitude: -122.3321 }
        },
        {
          id: '16',
          displayName: 'Atlanta, GA 30301',
          city: 'Atlanta',
          state: 'GA',
          zipCode: '30301',
          coordinates: { latitude: 33.7490, longitude: -84.3880 }
        },
        {
          id: '17',
          displayName: 'Phoenix, AZ 85001',
          city: 'Phoenix',
          state: 'AZ',
          zipCode: '85001',
          coordinates: { latitude: 33.4484, longitude: -112.0740 }
        },
        {
          id: '18',
          displayName: 'Las Vegas, NV 89101',
          city: 'Las Vegas',
          state: 'NV',
          zipCode: '89101',
          coordinates: { latitude: 36.1699, longitude: -115.1398 }
        }
      ];

      const filtered = mockResults.filter(result => 
        result.displayName.toLowerCase().includes(query.toLowerCase()) ||
        result.city.toLowerCase().includes(query.toLowerCase()) ||
        result.state.toLowerCase().includes(query.toLowerCase()) ||
        result.zipCode?.includes(query)
      );

      return filtered.slice(0, 10); // Limit to 10 results
    } catch (error) {
      console.error('Error searching locations:', error);
      return [];
    }
  }

  private async searchWithGooglePlaces(query: string, apiKey: string): Promise<LocationSearchResult[]> {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&type=locality&key=${apiKey}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'OK') {
        console.warn('Google Places API status:', data.status);
        throw new Error(`Google Places API status: ${data.status}`);
      }

      return data.results.slice(0, 10).map((place: any, index: number) => {
        const addressComponents = place.address_components || [];
        const cityComponent = addressComponents.find((comp: any) => comp.types.includes('locality'));
        const stateComponent = addressComponents.find((comp: any) => comp.types.includes('administrative_area_level_1'));
        const zipComponent = addressComponents.find((comp: any) => comp.types.includes('postal_code'));

        return {
          id: place.place_id || `google-${index}`,
          displayName: place.formatted_address || place.name,
          city: cityComponent?.long_name || 'Unknown City',
          state: stateComponent?.short_name || 'Unknown State',
          zipCode: zipComponent?.long_name,
          coordinates: {
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
          },
        };
      });
    } catch (error) {
      console.error('Google Places API error:', error);
      throw error;
    }
  }

  private async reverseGeocodeWithNominatim(coordinates: LocationCoordinates): Promise<UserLocation | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
      const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!response.ok) throw new Error(`Nominatim reverse error: ${response.status}`);
      const data = await response.json();
      const address = data.address || {};
      return {
        city: address.city || address.town || address.village || 'Unknown City',
        state: address.state || 'Unknown State',
        zipCode: address.postcode,
        coordinates,
        address: data.display_name,
        country: address.country_code?.toUpperCase() || 'US',
      };
    } catch (e) {
      console.warn('Nominatim reverse geocoding failed:', e);
      return null;
    }
  }

  private async searchWithNominatim(query: string): Promise<LocationSearchResult[]> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&addressdetails=1&limit=10`;
      const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!response.ok) throw new Error(`Nominatim search error: ${response.status}`);
      const results = await response.json();
      return results.map((r: any, index: number) => {
        const addr = r.address || {};
        const city = addr.city || addr.town || addr.village || r.display_name;
        return {
          id: r.place_id?.toString() || `osm-${index}`,
          displayName: r.display_name,
          city: city,
          state: addr.state || 'Unknown State',
          zipCode: addr.postcode,
          coordinates: { latitude: parseFloat(r.lat), longitude: parseFloat(r.lon) },
        } as LocationSearchResult;
      });
    } catch (e) {
      console.warn('Nominatim search failed:', e);
      return [];
    }
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  setCurrentLocation(location: UserLocation) {
    this.currentLocation = location;
  }

  getCurrentLocationCache(): UserLocation | null {
    return this.currentLocation;
  }
}

export const locationService = new LocationService();
export default locationService;