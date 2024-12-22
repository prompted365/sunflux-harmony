import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SolarAnalysisReports from "./SolarAnalysisReports";

const VendorClients = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Client Management</h2>
        <p className="text-muted-foreground">
          View and manage your client relationships.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Coming soon: Client management features.
          </p>
        </CardContent>
      </Card>

      <SolarAnalysisReports />
    </div>
  );
};

export default VendorClients;