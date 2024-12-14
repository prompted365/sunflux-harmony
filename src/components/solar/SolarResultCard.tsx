import { Card } from "@/components/ui/card";
import { SolarCalculation } from "./types";
import SolarMetrics from "./SolarMetrics";
import GenerateReportButton from "./GenerateReportButton";

interface SolarResultCardProps {
  calc: SolarCalculation;
}

const SolarResultCard = ({ calc }: SolarResultCardProps) => {
  return (
    <Card key={calc.id} className="overflow-hidden">
      <div className="relative h-48 bg-secondary">
        <img
          src="/placeholder.svg"
          alt="Solar panel visualization"
          className="w-full h-full object-cover"
        />
        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
          calc.status === 'completed' ? 'bg-green-100 text-green-800' : 
          'bg-yellow-100 text-yellow-800'
        }`}>
          {calc.status}
        </span>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Solar Potential Analysis</h3>
          <p className="text-sm text-gray-500">Detailed metrics for your property</p>
        </div>

        {calc.status === 'completed' && (
          <>
            <SolarMetrics calc={calc} />
            <GenerateReportButton calculationId={calc.id} />
          </>
        )}

        {calc.status === 'pending' && (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SolarResultCard;