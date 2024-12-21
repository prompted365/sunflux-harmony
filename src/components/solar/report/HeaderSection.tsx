import { BuildingSpecs } from "../types";

interface HeaderSectionProps {
  propertyAddress: string;
  buildingSpecs?: BuildingSpecs;
}

const HeaderSection = ({ propertyAddress, buildingSpecs }: HeaderSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">Solar Installation Analysis</h1>
        <p className="text-lg text-muted-foreground mt-2">{propertyAddress}</p>
        <p className="text-sm text-muted-foreground">
          Generated on: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default HeaderSection;