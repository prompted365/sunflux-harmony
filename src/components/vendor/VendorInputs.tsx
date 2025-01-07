import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PanelForm } from "./inputs/PanelForm";
import { InstallationCostsForm } from "./inputs/InstallationCostsForm";
import { AddonsForm } from "./inputs/AddonsForm";

const VendorInputs = () => {
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
            <PanelForm />
          </TabsContent>

          <TabsContent value="installation">
            <InstallationCostsForm />
          </TabsContent>

          <TabsContent value="addons">
            <AddonsForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorInputs;