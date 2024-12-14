import { useSolarCalculations } from "./solar/useSolarCalculations";
import SolarResultCard from "./solar/SolarResultCard";
import LoadingSkeleton from "./solar/LoadingSkeleton";

const SolarResults = () => {
  const { calculations, loading } = useSolarCalculations();

  if (loading) {
    return (
      <div className="space-y-6 mt-8">
        <h2 className="text-2xl font-bold text-gray-900">Solar Calculations</h2>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-900">Solar Calculations</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {calculations.map((calc) => (
          <SolarResultCard key={calc.id} calc={calc} />
        ))}
      </div>
    </div>
  );
};

export default SolarResults;