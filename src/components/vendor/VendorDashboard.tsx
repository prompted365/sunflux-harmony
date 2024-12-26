import { DashboardMetrics } from "./dashboard/DashboardMetrics";
import { TestPropertyButton } from "./dashboard/TestPropertyButton";
import { useToast } from "@/hooks/use-toast";

const VendorDashboard = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Vendor Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your solar business metrics and activities.
          </p>
        </div>
        <TestPropertyButton />
      </div>

      <DashboardMetrics />
    </div>
  );
};

export default VendorDashboard;