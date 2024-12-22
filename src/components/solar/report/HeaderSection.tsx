import { Card } from "@/components/ui/card";
import { BuildingSpecs } from "../types";

interface HeaderSectionProps {
  propertyAddress: string;
  buildingSpecs?: BuildingSpecs;
}

const HeaderSection = ({ propertyAddress, buildingSpecs }: HeaderSectionProps) => {
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
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default HeaderSection;