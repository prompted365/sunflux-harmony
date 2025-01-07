import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const InstallationCostsForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [installationCosts, setInstallationCosts] = useState({
    installation_cost_model: "",
    local_installation_cost: "",
    mounting_system_type: "",
    labor_cost: "",
    equipment_cost: "",
    permit_cost: "",
    overhead_cost: "",
    profit_margin: "0.2",
    minimum_project_size: "",
    maximum_project_size: "",
    region: "US", // Default region
  });

  const handleAddInstallationCost = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("installation_costs").insert({
        ...installationCosts,
        vendor_id: user.id,
        local_installation_cost: parseFloat(installationCosts.local_installation_cost),
        labor_cost: parseFloat(installationCosts.labor_cost),
        equipment_cost: parseFloat(installationCosts.equipment_cost),
        permit_cost: parseFloat(installationCosts.permit_cost),
        overhead_cost: parseFloat(installationCosts.overhead_cost),
        profit_margin: parseFloat(installationCosts.profit_margin),
        minimum_project_size: parseFloat(installationCosts.minimum_project_size),
        maximum_project_size: parseFloat(installationCosts.maximum_project_size),
        roof_type_multiplier: {
          flat: 1.0,
          pitched: 1.2,
          complex: 1.4,
        },
      });

      if (error) throw error;

      toast({
        title: "Installation costs added successfully",
        description: "Your installation cost configuration has been saved.",
      });

      setInstallationCosts({
        installation_cost_model: "",
        local_installation_cost: "",
        mounting_system_type: "",
        labor_cost: "",
        equipment_cost: "",
        permit_cost: "",
        overhead_cost: "",
        profit_margin: "0.2",
        minimum_project_size: "",
        maximum_project_size: "",
        region: "US",
      });
    } catch (error: any) {
      toast({
        title: "Error adding installation costs",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Installation Costs</CardTitle>
        <CardDescription>
          Define your installation costs and labor rates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Installation Cost Model</Label>
              <Input
                value={installationCosts.installation_cost_model}
                onChange={(e) =>
                  setInstallationCosts({
                    ...installationCosts,
                    installation_cost_model: e.target.value,
                  })
                }
                placeholder="e.g., Standard Residential"
              />
            </div>
            <div className="space-y-2">
              <Label>Mounting System Type</Label>
              <Input
                value={installationCosts.mounting_system_type}
                onChange={(e) =>
                  setInstallationCosts({
                    ...installationCosts,
                    mounting_system_type: e.target.value,
                  })
                }
                placeholder="e.g., Roof Mount"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Labor Cost ($)</Label>
              <Input
                type="number"
                value={installationCosts.labor_cost}
                onChange={(e) =>
                  setInstallationCosts({
                    ...installationCosts,
                    labor_cost: e.target.value,
                  })
                }
                placeholder="e.g., 2000"
              />
            </div>
            <div className="space-y-2">
              <Label>Equipment Cost ($)</Label>
              <Input
                type="number"
                value={installationCosts.equipment_cost}
                onChange={(e) =>
                  setInstallationCosts({
                    ...installationCosts,
                    equipment_cost: e.target.value,
                  })
                }
                placeholder="e.g., 5000"
              />
            </div>
            <div className="space-y-2">
              <Label>Permit Cost ($)</Label>
              <Input
                type="number"
                value={installationCosts.permit_cost}
                onChange={(e) =>
                  setInstallationCosts({
                    ...installationCosts,
                    permit_cost: e.target.value,
                  })
                }
                placeholder="e.g., 500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Overhead Cost ($)</Label>
              <Input
                type="number"
                value={installationCosts.overhead_cost}
                onChange={(e) =>
                  setInstallationCosts({
                    ...installationCosts,
                    overhead_cost: e.target.value,
                  })
                }
                placeholder="e.g., 1000"
              />
            </div>
            <div className="space-y-2">
              <Label>Profit Margin (%)</Label>
              <Input
                type="number"
                value={installationCosts.profit_margin}
                onChange={(e) =>
                  setInstallationCosts({
                    ...installationCosts,
                    profit_margin: e.target.value,
                  })
                }
                placeholder="e.g., 0.2 (20%)"
              />
            </div>
            <div className="space-y-2">
              <Label>Local Installation Cost ($)</Label>
              <Input
                type="number"
                value={installationCosts.local_installation_cost}
                onChange={(e) =>
                  setInstallationCosts({
                    ...installationCosts,
                    local_installation_cost: e.target.value,
                  })
                }
                placeholder="e.g., 1000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Minimum Project Size (kW)</Label>
              <Input
                type="number"
                value={installationCosts.minimum_project_size}
                onChange={(e) =>
                  setInstallationCosts({
                    ...installationCosts,
                    minimum_project_size: e.target.value,
                  })
                }
                placeholder="e.g., 4"
              />
            </div>
            <div className="space-y-2">
              <Label>Maximum Project Size (kW)</Label>
              <Input
                type="number"
                value={installationCosts.maximum_project_size}
                onChange={(e) =>
                  setInstallationCosts({
                    ...installationCosts,
                    maximum_project_size: e.target.value,
                  })
                }
                placeholder="e.g., 20"
              />
            </div>
          </div>

          <Button
            onClick={handleAddInstallationCost}
            disabled={loading}
            className="w-full"
          >
            Add Installation Cost Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};