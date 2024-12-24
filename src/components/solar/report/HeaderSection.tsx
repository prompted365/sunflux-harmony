import { Card } from "@/components/ui/card";
import { BuildingSpecs } from "../types";
import { supabase } from "@/integrations/supabase/client";

interface HeaderSectionProps {
  propertyAddress: string;
  buildingSpecs?: BuildingSpecs;
}

const HeaderSection = ({ propertyAddress, buildingSpecs }: HeaderSectionProps) => {
  // Create a signed URL for the RGB image if it exists
  const getSignedUrl = async (path: string) => {
    try {
      const { data } = await supabase.storage
        .from('solar_imagery')
        .getPublicUrl(path);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error in getSignedUrl:', error);
      return null;
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-primary">Solar Installation Report</h2>
        <p className="text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="font-semibold mb-2">Property Details</h3>
          <p className="text-muted-foreground">{propertyAddress}</p>
          {buildingSpecs?.imagery?.rgb && (
            <img 
              src={buildingSpecs.imagery.rgb}
              alt="Property" 
              className="mt-4 rounded-lg w-full object-cover h-48"
              onError={(e) => {
                console.error('Image load error:', e);
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>
        
        {buildingSpecs?.imagery?.annualFlux && (
          <div>
            <h3 className="font-semibold mb-2">Solar Analysis</h3>
            <img 
              src={buildingSpecs.imagery.annualFlux}
              alt="Solar Analysis" 
              className="mt-4 rounded-lg w-full object-cover h-48"
              onError={(e) => {
                console.error('Image load error:', e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default HeaderSection;