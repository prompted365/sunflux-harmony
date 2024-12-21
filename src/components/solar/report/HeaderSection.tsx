import { Card } from "@/components/ui/card";
import { MapPin, Calendar } from "lucide-react";

export interface HeaderSectionProps {
  propertyAddress: string;
  buildingSpecs?: {
    imagery?: {
      rgb?: string | null;
      dsm?: string | null;
      mask?: string | null;
      annualFlux?: string | null;
      monthlyFlux?: string | null;
    };
    imageryDate?: {
      year: number;
      month: number;
      day: number;
    };
  };
}

const HeaderSection = ({ propertyAddress, buildingSpecs }: HeaderSectionProps) => {
  const propertyImage = buildingSpecs?.imagery?.rgb || "/lovable-uploads/090fc8db-6e34-45e9-82ac-a4aed09338db.png";
  const imageryDate = buildingSpecs?.imageryDate 
    ? new Date(buildingSpecs.imageryDate.year, buildingSpecs.imageryDate.month - 1, buildingSpecs.imageryDate.day)
    : new Date();

  return (
    <>
      <div className="text-center space-y-4 print:space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent print:text-3xl">
          SunLink.ai Solar Analysis
        </h1>
        <p className="text-xl text-gray-600 print:text-lg">
          Your Path to Energy Independence
        </p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-secondary/10 via-background to-background border-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-primary">Property Details</h3>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <p>{propertyAddress}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <div>Analysis Date: {imageryDate.toLocaleDateString()}</div>
            </div>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <img 
              src={propertyImage}
              alt="Bird's Eye Property View"
              className="w-full h-full object-cover"
            />
            <p className="text-xs text-center mt-2 text-gray-600">
              Aerial Property View
              {buildingSpecs?.imageryDate && (
                <span className="ml-1">
                  (Captured: {imageryDate.toLocaleDateString()})
                </span>
              )}
            </p>
          </div>
        </div>
      </Card>
    </>
  );
};

export default HeaderSection;