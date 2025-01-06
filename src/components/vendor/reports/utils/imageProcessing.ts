import { FileObject } from '@supabase/storage-js';

export interface ProcessedImage {
  name: string;
  url: string;
  type: string;
  displayName: string;
  contentType: string;
}

export interface ImageFolder {
  name: string;
  timestamp: number;
  files: FileObject[];
}

export const getDisplayName = (type: string): string => {
  const displayNames: Record<string, string> = {
    'rgb': 'Satellite View',
    'annualflux': 'Annual Solar Analysis',
    'monthlyflux': 'Monthly Solar Analysis',
    'fluxoverrgb': 'Solar Analysis Overlay',
    'mask': 'Roof Mask Analysis',
    'dsm': 'Surface Model',
    'monthlyfluxcomposite': 'Monthly Analysis'
  };
  return displayNames[type.toLowerCase()] || type;
};

export const getContentType = (extension: string): string => {
  const contentTypes: Record<string, string> = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif'
  };
  return contentTypes[extension.toLowerCase()] || 'image/png';
};

export const parseImageType = (filename: string): string => {
  // Handle special cases like MonthlyFlux_1, MonthlyFluxComposite_1, etc.
  const baseType = filename.split('_')[0].toLowerCase();
  return baseType;
};

export const getMostRecentFolder = (folders: FileObject[]): ImageFolder | null => {
  if (!folders.length) return null;

  const propertyFolders = folders
    .map(folder => {
      const timestamp = parseInt(folder.name.split('_')[1] || '0');
      return {
        name: folder.name,
        timestamp,
        files: []
      };
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  return propertyFolders[0];
};