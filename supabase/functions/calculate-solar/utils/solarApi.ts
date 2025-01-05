import { BuildingInsightsResponse } from './types.ts';

// This file now only contains type definitions and utility functions
// The actual API calls are handled by the process-solar-data edge function
export async function getBuildingInsights(property: any, apiKey: string): Promise<BuildingInsightsResponse> {
  throw new Error('This method is deprecated. Use the process-solar-data edge function instead.');
}