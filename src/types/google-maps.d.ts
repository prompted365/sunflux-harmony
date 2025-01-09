declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google.maps {
  class places {
    static Autocomplete: {
      new (
        inputField: HTMLInputElement,
        opts?: AutocompleteOptions
      ): Autocomplete;
    };
  }

  interface AutocompleteOptions {
    componentRestrictions?: {
      country: string | string[];
    };
    fields?: string[];
    types?: string[];
  }

  class Autocomplete {
    addListener(eventName: string, handler: () => void): void;
    getPlace(): PlaceResult;
  }

  interface PlaceResult {
    address_components?: AddressComponent[];
    formatted_address?: string;
    geometry?: {
      location?: {
        lat(): number;
        lng(): number;
      };
    };
  }

  interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }

  namespace event {
    function clearInstanceListeners(instance: any): void;
  }
}

export {};