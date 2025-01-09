export const loadGoogleMaps = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    // Setup callbacks
    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve();
      } else {
        reject(new Error('Google Maps API failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Google Maps API script'));

    // Add script to document
    document.head.appendChild(script);
  });
};