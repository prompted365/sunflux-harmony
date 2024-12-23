import { SolarCalculation } from "./types";
import SolarMetricsCard from "./SolarMetricsCard";

interface SolarResultCardProps {
  calc: SolarCalculation;
}

const SolarResultCard = ({ calc }: SolarResultCardProps) => {
  return <SolarMetricsCard calc={calc} />;
};

export default SolarResultCard;