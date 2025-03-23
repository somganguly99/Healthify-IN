import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface Hospital {
  name: string;
  vicinity: string;
  distance: number;
  location: google.maps.LatLng;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          version: "beta",
          libraries: ["places", "geometry"]
        });

        await loader.load();
        setGoogleMapsLoaded(true);
      } catch (err) {
        console.error("Google Maps loading error:", err);
        setError("Failed to load Google Maps.");
        setLoading(false);
      }
    };

    loadGoogleMaps();

    // Cleanup watch position on unmount
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  const updateMapWithLocation = (coords: Coordinates) => {
    if (!googleMapsLoaded || !window.google || !window.google.maps) {
      return;
    }

    const location = new window.google.maps.LatLng(
      coords.latitude,
      coords.longitude
    );
    setUserLocation(location);

    if (mapInstance.current) {
      mapInstance.current.setCenter(location);
      mapInstance.current.setZoom(15);
    }
  };

  const getCurrentPosition = () => {
    if (!googleMapsLoaded || !window.google || !window.google.maps) {
      return;
    }

    setLoading(true);
    setError(null);

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    // Start watching position for real-time updates
    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        updateMapWithLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLoading(false);
      },
      async (err) => {
        console.error("Geolocation error:", err);
        let errorMessage = "Unable to access location. Please enable location services.";
        if (err.code === 1) {
          errorMessage = "Location access denied. Please enable location services in your browser.";
        } else if (err.code === 2) {
          errorMessage = "Location unavailable. Please try again.";
        } else if (err.code === 3) {
          errorMessage = "Location request timed out. Please try again.";
        }
        
        // Fallback to IP-based geolocation
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          if (data.latitude && data.longitude) {
            updateMapWithLocation({
              latitude: data.latitude,
              longitude: data.longitude
            });
            setError("Using approximate location. Enable location services for better accuracy.");
          } else {
            setError(errorMessage);
          }
        } catch (ipError) {
          setError(errorMessage);
        }
        setLoading(false);
      },
      options
    );
  };

  useEffect(() => {
    getCurrentPosition();
  }, [googleMapsLoaded]);

  useEffect(() => {
    if (!googleMapsLoaded || !userLocation || !mapRef.current) {
      return;
    }

    // Create map instance
    const map = new window.google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 15,
      mapTypeControl: true,
      streetViewControl: true,
      zoomControl: true,
      scaleControl: true,
      fullscreenControl: true,
      gestureHandling: 'greedy',
      mapTypeId: 'roadmap'
    });

    mapInstance.current = map;

    // Add user location marker with accuracy circle
    const userMarker = new window.google.maps.Marker({
      position: userLocation,
      map,
      title: "Your Location",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#1e3a8a",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#ffffff",
      },
      animation: window.google.maps.Animation.DROP
    });

    // Add accuracy circle
    new window.google.maps.Circle({
      map,
      center: userLocation,
      radius: 100, // 100 meters radius for better visibility
      strokeColor: "#1e3a8a",
      strokeOpacity: 0.3,
      strokeWeight: 2,
      fillColor: "#1e3a8a",
      fillOpacity: 0.1,
    });

    // Add search box
    const input = document.createElement("input");
    input.className = "pac-input";
    input.placeholder = "Search for a location";
    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);

    const searchBox = new window.google.maps.places.SearchBox(input);

    // Bias SearchBox results towards current map's viewport
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
    });

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (!places || places.length === 0) return;

      const bounds = new window.google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) return;

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });

    const request = {
      location: userLocation,
      radius: 5000,
      type: "hospital",
      fields: ["name", "vicinity", "geometry"]
    };

    const service = new window.google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const hospitalList: Hospital[] = results
          .map((place) => {
            if (!place.geometry?.location) return null;

            const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
              userLocation,
              place.geometry.location
            );

            return {
              name: place.name || "Unknown Hospital",
              vicinity: place.vicinity || "Address not available",
              distance: Math.round(distance / 100) / 10,
              location: place.geometry.location,
            };
          })
          .filter((h): h is Hospital => h !== null)
          .sort((a, b) => a.distance - b.distance); // Sort by distance

        setHospitals(hospitalList);
        
        // Add markers for each hospital
        hospitalList.forEach(hospital => {
          const marker = new window.google.maps.Marker({
            position: hospital.location,
            map,
            title: hospital.name,
            icon: {
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            },
            animation: window.google.maps.Animation.DROP
          });

          // Create info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-bold">${hospital.name}</h3>
                <p>${hospital.vicinity}</p>
                <p class="text-blue-600">${hospital.distance} km away</p>
              </div>
            `
          });

          // Add click listener to marker
          marker.addListener("click", () => {
            infoWindow.open(map, marker);
            map.setCenter(hospital.location);
            map.setZoom(16);
          });
        });
      } else {
        setError("No hospitals found nearby.");
      }
      setLoading(false);
    });
  }, [userLocation, googleMapsLoaded]);

  return (
    <div className="relative">
      <div ref={mapRef} className="h-[600px] w-full rounded-lg shadow-lg" />
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/80">
          <p>Loading map...</p>
        </div>
      )}
      {error && (
        <div className="absolute top-4 right-4 bg-red-50 p-4 rounded-lg shadow-lg">
          <p className="text-red-600">{error}</p>
          <button
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
            onClick={getCurrentPosition}
          >
            Retry Location
          </button>
        </div>
      )}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md max-h-[500px] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-3">Nearby Hospitals (5 km)</h3>
        {hospitals.length === 0 ? (
          <p className="text-gray-500">No hospitals found nearby</p>
        ) : (
          hospitals.map((hospital, index) => (
            <div 
              key={index} 
              className="mb-3 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => {
                if (mapInstance.current) {
                  mapInstance.current.setCenter(hospital.location);
                  mapInstance.current.setZoom(16);
                }
              }}
            >
              <h4 className="font-medium">{hospital.name}</h4>
              <p className="text-sm text-gray-600">{hospital.vicinity}</p>
              <p className="text-sm text-blue-600">{hospital.distance} km away</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Map;