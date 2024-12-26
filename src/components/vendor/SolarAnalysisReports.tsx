import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SolarResultCard from "../solar/SolarResultCard";
import { useSolarCalculations } from "../solar/useSolarCalculations";

const SolarAnalysisReports = () => {
  const { calculations, loading } = useSolarCalculations();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solar Analysis Reports</CardTitle>
      </CardHeader>
      <CardContent>
        {calculations?.length === 0 ? (
          <p className="text-muted-foreground text-sm">No solar analysis reports available.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {calculations?.map((calc) => (
              <SolarResultCard key={calc.id} calc={calc} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SolarAnalysisReports;