export async function geocodeAddress(address: string, city: string, state: string, zipCode: string): Promise<{lat: number, lng: number} | null> {
  const apiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY');
  if (!apiKey) {
    throw new Error('Google Cloud API key not configured');
  }

  const fullAddress = `${address}, ${city}, ${state} ${zipCode}`;
  const encodedAddress = encodeURIComponent(fullAddress);
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results[0]) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng
      };
    }
    
    console.error('Geocoding failed:', data);
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}