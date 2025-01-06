import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Zap, FileText, Building2 } from "lucide-react";
import { Property } from "../types";

interface DashboardMetricsProps {
  properties: Property[] | null;
}

export const DashboardMetrics = ({ properties }: DashboardMetricsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{properties?.length || 0}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {properties?.filter(p => 
              p.solar_calculations?.some(c => c.status === 'processing')
            ).length || 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Reports</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {properties?.filter(p => 
              p.solar_calculations?.some(c => c.status === 'completed')
            ).length || 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {properties?.reduce((acc, p) => {
              const systemSize = p.solar_calculations?.[0]?.system_size || 0;
              return acc + systemSize;
            }, 0).toFixed(1)} kW
          </div>
        </CardContent>
      </Card>
    </div>
  );
};