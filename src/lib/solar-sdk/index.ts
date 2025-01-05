import { supabase } from "@/integrations/supabase/client";

// Create and export a singleton instance that will be initialized with the API key
let solarAPI: any;

// Initialize the API with the secret from Supabase
export const initializeSolarAPI = async () => {
  const { data: { GOOGLE_MAPS_API_KEY } } = await supabase.functions.invoke('get-secret', {
    body: { name: 'GOOGLE_MAPS_API_KEY' }
  });
  
  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key not found in Supabase secrets');
    return null;
  }

  return GOOGLE_MAPS_API_KEY;
};

// Export the initialization function and a getter for the API instance
export const getSolarAPI = () => {
  if (!solarAPI) {
    throw new Error('Solar API not initialized. Call initializeSolarAPI() first.');
  }
  return solarAPI;
};