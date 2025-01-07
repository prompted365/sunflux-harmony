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
          <TabsList className="w-full border-b bg-transparent">
            <TabsTrigger 
              value="panels" 
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-accent/30 text-foreground/70 hover:text-foreground"
            >
              Solar Panels
            </TabsTrigger>
            <TabsTrigger 
              value="installation"
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-accent/30 text-foreground/70 hover:text-foreground"
            >
              Installation
            </TabsTrigger>
            <TabsTrigger 
              value="addons"
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-accent/30 text-foreground/70 hover:text-foreground"
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