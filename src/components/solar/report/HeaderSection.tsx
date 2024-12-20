import { Card } from "@/components/ui/card";
import { MapPin, Calendar } from "lucide-react";

interface HeaderSectionProps {
  propertyAddress: string;
}

const HeaderSection = ({ propertyAddress }: HeaderSectionProps) => {
  return (
    <>
      <div className="text-center space-y-4 print:space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent print:text-3xl">
          SunLink.ai Solar Analysis
        </h1>
        <p className="text-xl text-primary-foreground print:text-lg">
          Your Path to Energy Independence
        </p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-secondary/10 via-background to-background border-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-primary">Property Details</h3>
            <div className="flex items-center gap-2 text-primary-foreground">
              <MapPin className="h-4 w-4" />
              <p>{propertyAddress}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-primary-foreground">
              <Calendar className="h-4 w-4" />
              <div>Analysis Date: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <img 
              src="/placeholder.svg" 
              alt="Bird's Eye Property View"
              className="w-full h-full object-cover"
            />
            <p className="text-xs text-center mt-2 text-primary-foreground">Aerial Property View</p>
          </div>
        </div>
      </Card>
    </>
  );
};

export default HeaderSection;