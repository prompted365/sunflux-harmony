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

export const AddonsForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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

  const handleAddAddon = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("addons").insert({
        ...addon,
        vendor_id: user.id,
        cost: parseFloat(addon.cost),
        capacity: addon.capacity ? parseFloat(addon.capacity) : null,
        warranty_years: parseInt(addon.warranty_years),
        efficiency_rating: addon.efficiency_rating ? parseFloat(addon.efficiency_rating) : null,
        compatibility_specs: {},
        installation_requirements: {},
      });

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
  );
};