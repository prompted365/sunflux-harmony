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
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Add New Property</h2>
            <PropertySubmissionForm onSuccess={refetch} />
          </section>
          
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Your Properties</h2>
            <PropertyList
              properties={properties || []}
              selectedPropertyId={selectedPropertyId}
              onSelectProperty={setSelectedPropertyId}
            />
          </section>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {selectedPropertyId ? (
            <ReportViewer propertyId={selectedPropertyId} />
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Select a property to view its report
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;