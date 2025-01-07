export * from './auth';
export * from './property';
export * from './solar';
export * from './common';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
      };
      vendor_profiles: {
        Row: VendorProfile;
      };
      properties: {
        Row: Property;
      };
      solar_calculations: {
        Row: SolarCalculation;
      };
      processing_jobs: {
        Row: ProcessingJob;
      };
      solar_configurations: {
        Row: SolarConfiguration;
      };
    };
  };
}