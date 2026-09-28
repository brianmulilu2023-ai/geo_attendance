/**
 * Location Module
 * Handles geolocation and distance calculations using Haversine formula
 * Uses browser's Geolocation API and provides demo mode for testing
 */

const Location = {
  // Demo mode flag
  demoMode: true,
  demoDistance: 5, // meters - simulated distance from venue

  /**
   * Get current position from browser geolocation API
   * Returns promise with {latitude, longitude}
   */
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({
          code: 'NOT_SUPPORTED',
          message: 'Your browser does not support geolocation.'
        });
        return;
      }

      // If demo mode is enabled, return simulated position
      if (this.demoMode) {
        // Simulate University location with slight variation
        const lat = -1.0968 + (Math.random() - 0.5) * 0.0001;
        const lng = 34.7535 + (Math.random() - 0.5) * 0.0001;
        
        resolve({
          latitude: lat,
          longitude: lng,
          accuracy: 8,
          isDemoMode: true
        });
        return;
      }

      // Real geolocation API
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            isDemoMode: false
          });
        },
        (error) => {
          reject({
            code: error.code,
            message: this.getErrorMessage(error.code)
          });
        },
        options
      );
    });
  },

  /**
   * Haversine formula to calculate distance between two coordinates
   * Formula: a = sin²(Δφ/2) + cos(φ1)⋅cos(φ2)⋅sin²(Δλ/2)
   * c = 2⋅atan2(√a, √(1−a))
   * d = R⋅c where R is Earth's radius (6371 km)
   * 
   * Returns distance in meters
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    
    // Convert to radians
    const φ1 = this.toRadians(lat1);
    const φ2 = this.toRadians(lat2);
    const Δφ = this.toRadians(lat2 - lat1);
    const Δλ = this.toRadians(lon2 - lon1);

    // Haversine formula
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  },

  /**
   * Convert degrees to radians
   */
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  },

  /**
   * Check if student is within attendance radius
   * Returns {isWithinRadius: boolean, distance: number}
   */
  isWithinAttendanceRadius(studentLat, studentLon, venueLat, venueLon, radiusMeters) {
    const distance = this.calculateDistance(studentLat, studentLon, venueLat, venueLon);
    
    // If demo mode, simulate different distances
    if (this.demoMode) {
      const simulatedDist = distance + (this.demoDistance - 5); // Adjust by demo distance
      return {
        isWithinRadius: simulatedDist <= radiusMeters,
        distance: Math.round(simulatedDist * 10) / 10,
        actualDistance: distance
      };
    }

    return {
      isWithinRadius: distance <= radiusMeters,
      distance: distance,
      actualDistance: distance
    };
  },

  /**
   * Enable demo mode for testing without GPS
   * Allows simulating different distances
   */
  enableDemoMode(distanceMeters = 5) {
    this.demoMode = true;
    this.demoDistance = distanceMeters;
    console.log(`📍 Demo Mode Enabled - Simulating ${distanceMeters}m distance`);
  },

  /**
   * Disable demo mode to use real GPS
   */
  disableDemoMode() {
    this.demoMode = false;
    console.log('📍 Real GPS Mode Enabled');
  },

  /**
   * Get geolocation error message
   */
  getErrorMessage(errorCode) {
    const messages = {
      1: 'Location permission was denied. Please enable location access in your browser settings to mark attendance.',
      2: 'Unable to determine your location. Please check your GPS/internet connection and try again.',
      3: 'Location request timed out. Please try again.',
      'NOT_SUPPORTED': 'Your browser does not support geolocation. Please use a modern browser (Chrome, Firefox, Safari, Edge).'
    };
    return messages[errorCode] || 'An unknown location error occurred. Please try again.';
  },

  /**
   * Watch user position (for continuous tracking)
   * Returns watchId for later clearing
   */
  watchPosition(successCallback, errorCallback) {
    if (!navigator.geolocation) {
      errorCallback({
        code: 'NOT_SUPPORTED',
        message: 'Geolocation is not supported by your browser'
      });
      return null;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    return navigator.geolocation.watchPosition(
      (position) => {
        successCallback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        errorCallback({
          code: error.code,
          message: this.getErrorMessage(error.code)
        });
      },
      options
    );
  },

  /**
   * Clear position watch
   */
  clearWatch(watchId) {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  },

  /**
   * Format coordinates for display
   */
  formatCoordinates(latitude, longitude, decimals = 5) {
    return {
      latitude: latitude.toFixed(decimals),
      longitude: longitude.toFixed(decimals),
      display: `${latitude.toFixed(decimals)}, ${longitude.toFixed(decimals)}`
    };
  },

  /**
   * Format distance for display
   */
  formatDistance(meters) {
    if (meters < 1000) {
      return `${meters.toFixed(1)}m`;
    }
    return `${(meters / 1000).toFixed(2)}km`;
  }
};

// IMPORTANT SECURITY NOTES:
// ================================
// DEMO ONLY - FRONTEND LIMITATIONS
// ================================
// 
// This code demonstrates the location-based attendance workflow.
// However, there are critical security limitations in browser-based geolocation:
//
// 1. GPS Spoofing: Browser location can be spoofed using browser dev tools
// 2. VPN/Proxy: Users can mask their actual location
// 3. Simulated Positions: This demo mode allows arbitrary distance simulation
// 4. No Server Validation: Frontend cannot enforce actual attendance location
//
// PRODUCTION REQUIREMENTS:
// 
// For a real attendance system, MUST implement:
// - Server-side geolocation verification
// - IP address validation (server-side)
// - Device fingerprinting (server-side)
// - SSL/TLS encryption for all location data
// - Secure token-based authentication
// - Rate limiting and anomaly detection
// - Audit logs of all attendance events
// - Physical security measures at venues
//
// The frontend can collect location data, but the backend MUST
// validate and authorize attendance marking.
