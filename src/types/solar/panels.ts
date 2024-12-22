export interface PanelLayout {
  maxPanels?: number;
  maxArea?: number;
  orientation?: string;
  tilt?: number;
}

export interface PanelConfig {
  type?: string;
  capacity?: number;
  dimensions?: {
    width: number;
    height: number;
  };
}