import { PropertySubmissionForm } from "./PropertySubmissionForm";
import { PropertyList } from "./dashboard/PropertyList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Property } from "./types";
import { ReportViewer } from "./reports/ReportViewer";

const VendorDashboard = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  const { data: properties, refetch } = useQuery({
    queryKey: ['vendor-properties'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("vendor_id", user.id);

      if (error) throw error;
      return data as Property[];
    }
  });

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Add New Property</h2>
          <PropertySubmissionForm onSuccess={refetch} />
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Properties</h2>
            <PropertyList
              properties={properties || []}
              selectedPropertyId={selectedPropertyId}
              onSelectProperty={setSelectedPropertyId}
            />
          </div>
        </div>

        <div>
          {selectedPropertyId && (
            <ReportViewer propertyId={selectedPropertyId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;