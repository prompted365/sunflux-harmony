import { Users, FileText, Building2, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

const MetricCard = ({ title, value, icon, description }: MetricCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

export const DashboardMetrics = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Clients"
        value="0"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        description="Active client accounts"
      />
      <MetricCard
        title="Active Projects"
        value="0"
        icon={<Zap className="h-4 w-4 text-muted-foreground" />}
        description="Ongoing solar installations"
      />
      <MetricCard
        title="Reports Generated"
        value="0"
        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        description="Total solar analysis reports"
      />
      <MetricCard
        title="Panel Models"
        value="0"
        icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
        description="Available solar panel options"
      />
    </div>
  );
};