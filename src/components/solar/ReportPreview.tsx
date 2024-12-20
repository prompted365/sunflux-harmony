import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import { SolarCalculation } from "./types";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ReportPreviewProps {
  calc: SolarCalculation;
  propertyAddress: string;
}

const ReportPreview = ({ calc, propertyAddress }: ReportPreviewProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: { calculationId: calc.id }
      });

      if (error) throw error;

      if (data?.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }

      toast({
        title: "Success",
        description: "Report exported successfully",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export report",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 print:space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4 print:space-y-2">
        <h1 className="text-4xl font-bold text-primary print:text-3xl">SunLink.ai</h1>
        <h2 className="text-2xl text-muted-foreground print:text-xl">Solar Installation Analysis</h2>
      </div>

      {/* Property Details Card */}
      <Card className="p-6 bg-gradient-to-br from-secondary/10 to-transparent">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-primary">Property Details</h3>
          <p className="text-muted-foreground">{propertyAddress}</p>
          <p className="text-sm text-muted-foreground">Generated: {new Date().toLocaleDateString()}</p>
        </div>
      </Card>

      {/* System Specifications Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">System Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {calc.system_size && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">System Size</p>
              <p className="text-lg font-medium">{calc.system_size.toFixed(2)} kW</p>
            </div>
          )}
          {calc.panel_layout?.maxPanels && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Panel Count</p>
              <p className="text-lg font-medium">{calc.panel_layout.maxPanels}</p>
            </div>
          )}
          {calc.irradiance_data?.maxSunshineHours && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Annual Sunshine Hours</p>
              <p className="text-lg font-medium">{calc.irradiance_data.maxSunshineHours.toFixed(0)}</p>
            </div>
          )}
          {calc.estimated_production?.yearlyEnergyDcKwh && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Annual Energy Production</p>
              <p className="text-lg font-medium">{calc.estimated_production.yearlyEnergyDcKwh.toFixed(2)} kWh</p>
            </div>
          )}
        </div>
      </Card>

      {/* Financial Analysis Card */}
      {calc.financial_analysis && (
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
          <h3 className="text-lg font-semibold text-primary mb-4">Financial Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Initial Cost</p>
              <p className="text-lg font-medium">
                ${calc.financial_analysis.initialCost?.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Federal Incentive</p>
              <p className="text-lg font-medium">
                ${calc.financial_analysis.federalIncentive?.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Monthly Savings</p>
              <p className="text-lg font-medium">
                ${calc.financial_analysis.monthlyBillSavings?.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Payback Period</p>
              <p className="text-lg font-medium">
                {calc.financial_analysis.paybackYears?.toFixed(1)} years
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground print:text-xs">
        Powered by SunLink.ai - Accelerating Solar Adoption Through Innovation
      </div>

      {/* Export Actions */}
      <div className="flex justify-end gap-4 print:hidden">
        <Button
          variant="outline"
          onClick={() => window.print()}
          className="gap-2"
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="gap-2"
        >
          <FileDown className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export PDF"}
        </Button>
      </div>
    </div>
  );
};

export default ReportPreview;