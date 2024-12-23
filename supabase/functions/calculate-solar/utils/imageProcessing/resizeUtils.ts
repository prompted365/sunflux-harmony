import { createCanvas } from 'https://deno.land/x/canvas@v1.4.1/mod.ts';

export function resizeImage(
  originalWidth: number,
  originalHeight: number,
  targetWidth: number,
  targetHeight: number,
  imageData: Uint8Array
): Uint8Array {
  const sourceCanvas = createCanvas(originalWidth, originalHeight);
  const sourceCtx = sourceCanvas.getContext('2d');
  const imageDataObj = sourceCtx.createImageData(originalWidth, originalHeight);
  imageDataObj.data.set(imageData);
  sourceCtx.putImageData(imageDataObj, 0, 0);

  const targetCanvas = createCanvas(targetWidth, targetHeight);
  const targetCtx = targetCanvas.getContext('2d');
  targetCtx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);

  return new Uint8Array(targetCtx.getImageData(0, 0, targetWidth, targetHeight).data);
}

export function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxDimension: number
): { width: number; height: number } {
  if (originalWidth <= maxDimension && originalHeight <= maxDimension) {
    return { width: originalWidth, height: originalHeight };
  }

  const ratio = originalWidth / originalHeight;
  if (ratio > 1) {
    return {
      width: maxDimension,
      height: Math.round(maxDimension / ratio)
    };
  } else {
    return {
      width: Math.round(maxDimension * ratio),
      height: maxDimension
    };
  }
}