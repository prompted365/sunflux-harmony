export type LayerType = 'dsm' | 'rgb' | 'mask' | 'annual_flux' | 'monthly_flux' | 'hourly_shade';

export interface LayerConfig {
  id: LayerType;
  label: string;
  description: string;
  colormap?: string[];
  defaultVisible: boolean;
}

export const LAYER_CONFIGS: Record<LayerType, LayerConfig> = {
  dsm: {
    id: 'dsm',
    label: 'Surface Model',
    description: 'Digital Surface Model showing elevation data',
    colormap: ['#000080', '#4B0082', '#800080', '#FF0000', '#FFA500', '#FFFF00'],
    defaultVisible: true
  },
  rgb: {
    id: 'rgb',
    label: 'Aerial Image',
    description: 'RGB aerial photography',
    defaultVisible: true
  },
  mask: {
    id: 'mask',
    label: 'Building Mask',
    description: 'Building footprint mask',
    defaultVisible: true
  },
  annual_flux: {
    id: 'annual_flux',
    label: 'Annual Solar',
    description: 'Annual solar irradiance',
    colormap: ['#000080', '#0000FF', '#00FFFF', '#00FF00', '#FFFF00', '#FF0000'],
    defaultVisible: true
  },
  monthly_flux: {
    id: 'monthly_flux',
    label: 'Monthly Solar',
    description: 'Monthly solar irradiance',
    colormap: ['#000080', '#0000FF', '#00FFFF', '#00FF00', '#FFFF00', '#FF0000'],
    defaultVisible: true
  },
  hourly_shade: {
    id: 'hourly_shade',
    label: 'Hourly Shade',
    description: 'Hourly shade analysis',
    defaultVisible: false
  }
};