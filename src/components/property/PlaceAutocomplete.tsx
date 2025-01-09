import React, { useEffect, useRef, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { loadGoogleMaps } from '@/utils/loadGoogleMaps';
import { Input } from '../ui/input';
import { Loader2 } from 'lucide-react';

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
  }) => void;
  placeholder?: string;
  className?: string;
}

const PlaceAutocomplete = ({ onPlaceSelect, placeholder, className }: PlaceAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let autocomplete: google.maps.places.Autocomplete | null = null;

    const initializeAutocomplete = async () => {
      try {
        const { data: { GOOGLE_MAPS_API_KEY }, error } = await supabase.functions.invoke('get-secret', {
          body: { name: 'GOOGLE_MAPS_API_KEY' }
        });

        if (error) throw error;
        if (!GOOGLE_MAPS_API_KEY) throw new Error('Google Maps API key not found');

        await loadGoogleMaps(GOOGLE_MAPS_API_KEY);

        if (inputRef.current) {
          autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
            componentRestrictions: { country: 'us' },
            fields: ['address_components', 'geometry'],
            types: ['address']
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete?.getPlace();
            if (!place?.address_components) return;

            let address = '', city = '', state = '', zipCode = '';
            let latitude = place.geometry?.location?.lat();
            let longitude = place.geometry?.location?.lng();

            place.address_components.forEach(component => {
              const type = component.types[0];
              switch (type) {
                case 'street_number':
                  address = component.long_name + ' ';
                  break;
                case 'route':
                  address += component.long_name;
                  break;
                case 'locality':
                  city = component.long_name;
                  break;
                case 'administrative_area_level_1':
                  state = component.short_name;
                  break;
                case 'postal_code':
                  zipCode = component.long_name;
                  break;
              }
            });

            onPlaceSelect({
              address,
              city,
              state,
              zipCode,
              latitude,
              longitude
            });
          });
        }
        setLoading(false);
      } catch (err) {
        console.error('Error initializing autocomplete:', err);
        setError(err instanceof Error ? err.message : 'Failed to load Google Maps');
        setLoading(false);
      }
    };

    initializeAutocomplete();

    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [onPlaceSelect]);

  if (error) {
    return <Input className={className} placeholder="Error loading address search" disabled />;
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        className={className}
        placeholder={placeholder || "Enter an address"}
        disabled={loading}
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

export default PlaceAutocomplete;