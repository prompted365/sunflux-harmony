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

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Vendor Inputs</h2>
        <p className="text-muted-foreground mb-6">
          Manage your solar panel catalog and installation specifications.
        </p>

        <Tabs defaultValue="panels" className="space-y-6">
          <TabsList className="bg-muted/10">
            <TabsTrigger value="panels">Solar Panels</TabsTrigger>
            <TabsTrigger value="installation">Installation</TabsTrigger>
            <TabsTrigger value="addons">Add-ons</TabsTrigger>
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
                <p className="text-sm text-muted-foreground">
                  Coming soon: Installation cost management.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addons">
            <Card>
              <CardHeader>
                <CardTitle>Additional Products</CardTitle>
                <CardDescription>
                  Manage additional products like batteries and inverters.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Coming soon: Add-on product management.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorInputs;