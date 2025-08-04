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
        // For web, use browser geolocation API
        return new Promise((resolve) => {
          if ('geolocation' in navigator) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
              this.locationPermissionGranted = result.state === 'granted';
              resolve(this.locationPermissionGranted);
            }).catch(() => {
              this.locationPermissionGranted = false;
              resolve(false);
            });
          } else {
            this.locationPermissionGranted = false;
            resolve(false);
          }
        });
      } else {
        // For mobile, use expo-location
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
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 100
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
      if (Platform.OS === 'web') {
        // For web, we'll use a mock implementation or external service
        // In a real app, you'd use a service like Google Maps Geocoding API
        return this.mockReverseGeocode(coordinates);
      } else {
        // For mobile, use expo-location reverse geocoding
        const results = await Location.reverseGeocodeAsync(coordinates);
        if (results.length > 0) {
          const result = results[0];
          return {
            city: result.city || 'Unknown City',
            state: result.region || 'Unknown State',
            zipCode: result.postalCode || undefined,
            coordinates,
            address: `${result.street || ''} ${result.streetNumber || ''}`.trim(),
            country: result.country || 'US'
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return this.mockReverseGeocode(coordinates);
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
      // In a real app, you'd use a geocoding service like Google Places API
      // For now, we'll use mock data with filtering
      const mockResults: LocationSearchResult[] = [
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
        {
          id: '4',
          displayName: 'Rockford, IL 61101',
          city: 'Rockford',
          state: 'IL',
          zipCode: '61101',
          coordinates: { latitude: 42.2711, longitude: -89.0940 }
        },
        {
          id: '5',
          displayName: 'Champaign, IL 61820',
          city: 'Champaign',
          state: 'IL',
          zipCode: '61820',
          coordinates: { latitude: 40.1164, longitude: -88.2434 }
        },
        {
          id: '6',
          displayName: 'Aurora, IL 60505',
          city: 'Aurora',
          state: 'IL',
          zipCode: '60505',
          coordinates: { latitude: 41.7606, longitude: -88.3201 }
        },
        {
          id: '7',
          displayName: 'Joliet, IL 60431',
          city: 'Joliet',
          state: 'IL',
          zipCode: '60431',
          coordinates: { latitude: 41.5250, longitude: -88.0817 }
        },
        {
          id: '8',
          displayName: 'Naperville, IL 60540',
          city: 'Naperville',
          state: 'IL',
          zipCode: '60540',
          coordinates: { latitude: 41.7508, longitude: -88.1535 }
        },
        {
          id: '9',
          displayName: 'Elgin, IL 60120',
          city: 'Elgin',
          state: 'IL',
          zipCode: '60120',
          coordinates: { latitude: 42.0354, longitude: -88.2826 }
        },
        {
          id: '10',
          displayName: 'Waukegan, IL 60085',
          city: 'Waukegan',
          state: 'IL',
          zipCode: '60085',
          coordinates: { latitude: 42.3636, longitude: -87.8448 }
        }
      ];

      const filtered = mockResults.filter(result => 
        result.displayName.toLowerCase().includes(query.toLowerCase()) ||
        result.city.toLowerCase().includes(query.toLowerCase()) ||
        result.zipCode?.includes(query)
      );

      return filtered.slice(0, 10); // Limit to 10 results
    } catch (error) {
      console.error('Error searching locations:', error);
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