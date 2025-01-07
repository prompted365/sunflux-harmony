import { PropertyList } from "./dashboard/PropertyList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Property } from "./types";
import { ReportViewer } from "./reports/ReportViewer";
import { FileText } from "lucide-react"; // Add this import

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
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <section className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Properties</h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage your properties and view their solar analysis reports
              </p>
            </div>
            <PropertyList
              properties={properties || []}
              selectedPropertyId={selectedPropertyId}
              onSelectProperty={setSelectedPropertyId}
              onSuccess={refetch}
            />
          </section>
        </div>

        <div className="lg:h-[calc(100vh-8rem)] lg:sticky lg:top-24">
          <section className="bg-white rounded-xl shadow-lg h-full border border-gray-100">
            <div className="p-6 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Solar Analysis Report</h2>
              <p className="text-sm text-gray-500 mt-1">
                {selectedPropertyId ? "View detailed solar potential analysis" : "Select a property to view its report"}
              </p>
            </div>
            <div className="p-6">
              {selectedPropertyId ? (
                <ReportViewer propertyId={selectedPropertyId} />
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Property Selected</h3>
                  <p className="text-gray-500 max-w-sm">
                    Select a property from the list to view its detailed solar analysis report
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;