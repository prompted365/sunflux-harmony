import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const VendorInputs = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [panel, setPanel] = useState({
    panel_model: "",
    vendor_name: "",
    rated_power: "",
    efficiency: "",
    price: "",
  });

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
  });

  const [addon, setAddon] = useState({
    addon_type: "",
    cost: "",
    capacity: "",
    manufacturer: "",
    model_number: "",
    warranty_years: "10",
    efficiency_rating: "",
    category: "",
    description: "",
  });

  const handleAddPanel = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.from("panels").insert([
        {
          ...panel,
          rated_power: parseFloat(panel.rated_power),
          efficiency: parseFloat(panel.efficiency),
          price: parseFloat(panel.price),
          region: "US", // Default for now
          dimensions: { width: 1.0, height: 1.65 }, // Default dimensions
          degradation_rate: 0.5, // Default degradation rate
          warranty: { years: 25 }, // Default warranty
          shipping_cost: 0, // Default shipping cost
        },
      ]);

      if (error) throw error;

      toast({
        title: "Panel added successfully",
        description: "The new panel has been added to your catalog.",
      });

      setPanel({
        panel_model: "",
        vendor_name: "",
        rated_power: "",
        efficiency: "",
        price: "",
      });
    } catch (error: any) {
      toast({
        title: "Error adding panel",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstallationCost = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.from("installation_costs").insert([
        {
          ...installationCosts,
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
        },
      ]);

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

  const handleAddAddon = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.from("addons").insert([
        {
          ...addon,
          cost: parseFloat(addon.cost),
          capacity: addon.capacity ? parseFloat(addon.capacity) : null,
          warranty_years: parseInt(addon.warranty_years),
          efficiency_rating: addon.efficiency_rating ? parseFloat(addon.efficiency_rating) : null,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Add-on added successfully",
        description: "The new add-on has been added to your catalog.",
      });

      setAddon({
        addon_type: "",
        cost: "",
        capacity: "",
        manufacturer: "",
        model_number: "",
        warranty_years: "10",
        efficiency_rating: "",
        category: "",
        description: "",
      });
    } catch (error: any) {
      toast({
        title: "Error adding add-on",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Vendor Inputs</h2>
        <p className="text-muted-foreground mb-6">
          Manage your solar panel catalog and installation specifications.
        </p>

        <Tabs defaultValue="panels" className="space-y-6">
          <TabsList className="bg-muted/10 w-full border-b">
            <TabsTrigger 
              value="panels" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Solar Panels
            </TabsTrigger>
            <TabsTrigger 
              value="installation"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Installation
            </TabsTrigger>
            <TabsTrigger 
              value="addons"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Add-ons
            </TabsTrigger>
          </TabsList>

          <TabsContent value="panels">
            <Card>
              <CardHeader>
                <CardTitle>Add New Panel</CardTitle>
                <CardDescription>
                  Add a new solar panel model to your catalog.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Panel Model</Label>
                      <Input
                        value={panel.panel_model}
                        onChange={(e) =>
                          setPanel({ ...panel, panel_model: e.target.value })
                        }
                        placeholder="e.g., SunPower X22-360"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Vendor Name</Label>
                      <Input
                        value={panel.vendor_name}
                        onChange={(e) =>
                          setPanel({ ...panel, vendor_name: e.target.value })
                        }
                        placeholder="e.g., SunPower"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Rated Power (W)</Label>
                      <Input
                        type="number"
                        value={panel.rated_power}
                        onChange={(e) =>
                          setPanel({ ...panel, rated_power: e.target.value })
                        }
                        placeholder="e.g., 360"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Efficiency (%)</Label>
                      <Input
                        type="number"
                        value={panel.efficiency}
                        onChange={(e) =>
                          setPanel({ ...panel, efficiency: e.target.value })
                        }
                        placeholder="e.g., 22.8"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price ($)</Label>
                      <Input
                        type="number"
                        value={panel.price}
                        onChange={(e) =>
                          setPanel({ ...panel, price: e.target.value })
                        }
                        placeholder="e.g., 300"
                      />
                    </div>
                  </div>

                  <Button onClick={handleAddPanel} disabled={loading} className="w-full">
                    Add Panel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="installation">
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
          </TabsContent>

          <TabsContent value="addons">
            <Card>
              <CardHeader>
                <CardTitle>Additional Products</CardTitle>
                <CardDescription>
                  Add new products like batteries and inverters to your catalog.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={addon.category}
                        onValueChange={(value) =>
                          setAddon({ ...addon, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="battery">Battery</SelectItem>
                          <SelectItem value="inverter">Inverter</SelectItem>
                          <SelectItem value="monitoring">Monitoring System</SelectItem>
                          <SelectItem value="optimizer">Power Optimizer</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Manufacturer</Label>
                      <Input
                        value={addon.manufacturer}
                        onChange={(e) =>
                          setAddon({ ...addon, manufacturer: e.target.value })
                        }
                        placeholder="e.g., Tesla"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Model Number</Label>
                      <Input
                        value={addon.model_number}
                        onChange={(e) =>
                          setAddon({ ...addon, model_number: e.target.value })
                        }
                        placeholder="e.g., PW2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cost ($)</Label>
                      <Input
                        type="number"
                        value={addon.cost}
                        onChange={(e) =>
                          setAddon({ ...addon, cost: e.target.value })
                        }
                        placeholder="e.g., 8000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Capacity (if applicable)</Label>
                      <Input
                        type="number"
                        value={addon.capacity}
                        onChange={(e) =>
                          setAddon({ ...addon, capacity: e.target.value })
                        }
                        placeholder="e.g., 13.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Warranty (years)</Label>
                      <Input
                        type="number"
                        value={addon.warranty_years}
                        onChange={(e) =>
                          setAddon({ ...addon, warranty_years: e.target.value })
                        }
                        placeholder="e.g., 10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Efficiency Rating (%)</Label>
                      <Input
                        type="number"
                        value={addon.efficiency_rating}
                        onChange={(e) =>
                          setAddon({ ...addon, efficiency_rating: e.target.value })
                        }
                        placeholder="e.g., 98"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={addon.description}
                      onChange={(e) =>
                        setAddon({ ...addon, description: e.target.value })
                      }
                      placeholder="Enter product description"
                    />
                  </div>

                  <Button onClick={handleAddAddon} disabled={loading} className="w-full">
                    Add Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorInputs;