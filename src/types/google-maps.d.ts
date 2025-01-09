declare global {
  interface Window {
    google: typeof google;
  }

  namespace google.maps {
    class Autocomplete extends google.maps.places.Autocomplete {}
    
    namespace places {
      class Autocomplete {
        constructor(
          inputField: HTMLInputElement,
          opts?: google.maps.places.AutocompleteOptions
        );
        addListener(eventName: string, handler: Function): google.maps.MapsEventListener;
        getPlace(): google.maps.places.PlaceResult;
      }
      
      interface AutocompleteOptions {
        bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
        componentRestrictions?: google.maps.places.ComponentRestrictions;
        fields?: string[];
        types?: string[];
      }

      interface PlaceResult {
        address_components?: AddressComponent[];
        formatted_address?: string;
        geometry?: {
          location: google.maps.LatLng;
          viewport?: google.maps.LatLngBounds;
        };
        name?: string;
        place_id?: string;
      }

      interface AddressComponent {
        long_name: string;
        short_name: string;
        types: string[];
      }

      interface ComponentRestrictions {
        country: string | string[];
      }
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
      extend(point: LatLng): LatLngBounds;
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    interface MapsEventListener {
      remove(): void;
    }
  }
}

export {};