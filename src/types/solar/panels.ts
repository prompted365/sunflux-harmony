export interface PanelLayout {
  maxPanels: number;
  maxArea: number;
  orientation?: string;
  tilt?: number;
  panelDimensions: {
    width: number;
    height: number;
  };
}

export interface PanelConfig {
  type?: string;
  capacity?: number;
  dimensions?: {
    width: number;
    height: number;
  };
}