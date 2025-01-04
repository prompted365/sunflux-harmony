import { useState } from "react";
import Navigation from "@/components/Navigation";
import VendorBranding from "@/components/vendor/VendorBranding";
import VendorInputs from "@/components/vendor/VendorInputs";
import VendorClients from "@/components/vendor/VendorClients";
import VendorDashboard from "@/components/vendor/VendorDashboard";
import { VendorLayout } from "@/components/vendor/VendorLayout";
import { useVendorProfile } from "@/hooks/useVendorProfile";

const Vendor = () => {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const { vendorProfile, loading } = useVendorProfile();

  const renderContent = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    switch (activeSection) {
      case "dashboard":
        return <VendorDashboard />;
      case "branding":
        return <VendorBranding vendorProfile={vendorProfile} />;
      case "inputs":
        return <VendorInputs />;
      case "clients":
        return <VendorClients />;
      default:
        return <VendorDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <VendorLayout 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      >
        {renderContent()}
      </VendorLayout>
    </div>
  );
};

export default Vendor;