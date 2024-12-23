import * as geotiff from 'https://esm.sh/geotiff@2.1.3';

export async function decodeGeoTiff(arrayBuffer: ArrayBuffer) {
  try {
    const tiff = await geotiff.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    const rasters = await image.readRasters();

    console.log('GeoTIFF metadata:', {
      width: rasters.width,
      height: rasters.height,
      count: rasters.length,
      sampleFormat: image.getSampleFormat(),
      bitsPerSample: image.getBitsPerSample(),
      samplesPerPixel: image.getSamplesPerPixel()
    });

    return {
      width: rasters.width,
      height: rasters.height,
      rasters: [...Array(rasters.length).keys()].map(i => 
        Array.from(rasters[i] as unknown as Uint8Array)
      ),
      bounds: { north: 0, south: 0, east: 0, west: 0 }
    };
  } catch (error) {
    console.error('Error decoding GeoTIFF:', error);
    throw new Error(`Failed to decode GeoTIFF: ${error.message}`);
  }
}