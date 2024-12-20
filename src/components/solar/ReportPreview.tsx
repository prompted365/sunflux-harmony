import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import { SolarCalculation } from "./types";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    <div className="w-full max-w-5xl mx-auto space-y-8 print:space-y-6 bg-background">
      {/* Header Section */}
      <div className="text-center space-y-4 print:space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent print:text-3xl">
          SunLink.ai Solar Analysis
        </h1>
        <p className="text-xl text-muted-foreground print:text-lg">
          Your Path to Energy Independence
        </p>
      </div>

      {/* Property Overview Card */}
      <Card className="p-6 bg-gradient-to-br from-secondary/10 via-background to-background border-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-primary">Property Details</h3>
            <p className="text-muted-foreground">{propertyAddress}</p>
            <div className="text-sm text-muted-foreground">
              Analysis Date: {new Date().toLocaleDateString()}
            </div>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <img 
              src="/placeholder.svg" 
              alt="Bird's Eye Property View"
              className="w-full h-full object-cover"
            />
            <p className="text-xs text-center mt-2 text-muted-foreground">Aerial Property View</p>
          </div>
        </div>
      </Card>

      {/* Solar Analysis Imagery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-2">
            <img 
              src="/placeholder.svg" 
              alt="Solar Irradiance Map"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm text-center text-muted-foreground">Solar Irradiance Analysis</p>
        </Card>
        <Card className="p-4">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-2">
            <img 
              src="/placeholder.svg" 
              alt="Solar Panel Layout"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm text-center text-muted-foreground">Optimal Panel Layout</p>
        </Card>
      </div>

      {/* System Specifications Card */}
      <Card className="p-6 border-2">
        <h3 className="text-2xl font-semibold text-primary mb-6">System Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {calc.system_size && (
            <div className="space-y-2 p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">System Size</p>
              <p className="text-2xl font-semibold text-primary">{calc.system_size.toFixed(2)} kW</p>
              <p className="text-xs text-muted-foreground">Premium Tier-1 Solar Panels</p>
            </div>
          )}
          {calc.panel_layout?.maxPanels && (
            <div className="space-y-2 p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Solar Array</p>
              <p className="text-2xl font-semibold text-primary">{calc.panel_layout.maxPanels} Panels</p>
              <p className="text-xs text-muted-foreground">High-Efficiency Configuration</p>
            </div>
          )}
          {calc.estimated_production?.yearlyEnergyDcKwh && (
            <div className="space-y-2 p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Annual Production</p>
              <p className="text-2xl font-semibold text-primary">
                {Math.round(calc.estimated_production.yearlyEnergyDcKwh).toLocaleString()} kWh
              </p>
              <p className="text-xs text-muted-foreground">Clean Energy Generated</p>
            </div>
          )}
        </div>
      </Card>

      {/* Financial Analysis Card */}
      {calc.financial_analysis && (
        <Card className="p-6 bg-gradient-to-br from-primary/5 via-background to-background border-2">
          <h3 className="text-2xl font-semibold text-primary mb-6">Financial Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2 p-4 rounded-lg bg-white/50">
              <p className="text-sm text-muted-foreground">Initial Investment</p>
              <p className="text-2xl font-semibold text-primary">
                ${calc.financial_analysis.initialCost.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Before Incentives</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-white/50">
              <p className="text-sm text-muted-foreground">Federal Tax Credit</p>
              <p className="text-2xl font-semibold text-green-600">
                -${calc.financial_analysis.federalIncentive.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">30% of System Cost</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-white/50">
              <p className="text-sm text-muted-foreground">Monthly Savings</p>
              <p className="text-2xl font-semibold text-primary">
                ${calc.financial_analysis.monthlyBillSavings.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Average Utility Savings</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-white/50">
              <p className="text-sm text-muted-foreground">Payback Period</p>
              <p className="text-2xl font-semibold text-primary">
                {calc.financial_analysis.paybackYears.toFixed(1)} Years
              </p>
              <p className="text-xs text-muted-foreground">Return on Investment</p>
            </div>
          </div>
        </Card>
      )}

      {/* Environmental Impact Card */}
      <Card className="p-6 bg-gradient-to-br from-green-50 via-background to-background border-2">
        <h3 className="text-2xl font-semibold text-primary mb-6">Environmental Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 p-4 rounded-lg bg-white/50">
            <p className="text-sm text-muted-foreground">Carbon Offset</p>
            <p className="text-2xl font-semibold text-green-600">
              {(calc.irradiance_data?.carbonOffset || 0).toFixed(1)} tons
            </p>
            <p className="text-xs text-muted-foreground">Annual CO₂ Reduction</p>
          </div>
          <div className="space-y-2 p-4 rounded-lg bg-white/50">
            <p className="text-sm text-muted-foreground">Trees Equivalent</p>
            <p className="text-2xl font-semibold text-green-600">
              {Math.round((calc.irradiance_data?.carbonOffset || 0) * 45)} trees
            </p>
            <p className="text-xs text-muted-foreground">Annual Impact</p>
          </div>
          <div className="space-y-2 p-4 rounded-lg bg-white/50">
            <p className="text-sm text-muted-foreground">Clean Energy</p>
            <p className="text-2xl font-semibold text-green-600">
              {calc.estimated_production?.yearlyEnergyDcKwh 
                ? Math.round(calc.estimated_production.yearlyEnergyDcKwh / 10700)
                : 0} homes
            </p>
            <p className="text-xs text-muted-foreground">Equivalent Power</p>
          </div>
        </div>
      </Card>

      {/* Next Steps Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 via-background to-background border-2">
        <h3 className="text-2xl font-semibold text-primary mb-4">Next Steps</h3>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Your home has excellent solar potential. Here's what happens next:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Schedule a detailed site assessment</li>
            <li>Receive your custom installation plan</li>
            <li>Review financing options</li>
            <li>Begin your journey to energy independence</li>
          </ol>
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center space-y-2 text-sm text-muted-foreground print:text-xs">
        <p>Generated by SunLink.ai - Accelerating Solar Adoption Through Innovation</p>
        <p className="text-xs">Analysis based on current market conditions and may be subject to change</p>
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