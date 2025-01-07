import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Plus, Trash2, Home, MapPin, FileText } from "lucide-react";
import { Property } from "../types";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PropertySubmissionForm } from "../PropertySubmissionForm";

export const PropertyList = ({
  properties,
  selectedPropertyId,
  onSelectProperty,
  onSuccess,
}: {
  properties: Property[] | undefined;
  selectedPropertyId: string | null;
  onSelectProperty: (id: string) => void;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  const { mutate: deletePropertyMutation } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-properties'] });
      toast.success("Property deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete property");
      console.error("Delete error:", error);
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'processing':
        return 'bg-blue-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-yellow-500 text-white';
    }
  };

  return (
    <div className="relative">
      <div className="absolute -top-[4.5rem] left-6">
        <Drawer>
          <DrawerTrigger asChild>
            <Button 
              size="icon" 
              className="rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Add New Property</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <PropertySubmissionForm onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ['vendor-properties'] });
                if (onSuccess) onSuccess();
              }} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-3 p-6">
          {properties?.map((property) => (
            <div
              key={property.id}
              className="flex items-center gap-2"
            >
              <Button
                variant={selectedPropertyId === property.id ? "default" : "outline"}
                className={`w-full justify-start transition-all duration-200 rounded-xl p-4 ${
                  selectedPropertyId === property.id 
                    ? 'shadow-md bg-primary/10 hover:bg-primary/20 border-primary/20' 
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
                onClick={() => onSelectProperty(property.id)}
              >
                <div className="flex items-center w-full gap-4">
                  <div className={`rounded-lg p-2 ${
                    selectedPropertyId === property.id 
                      ? 'bg-primary/10' 
                      : 'bg-gray-100'
                  }`}>
                    <Home className={`h-5 w-5 ${
                      selectedPropertyId === property.id 
                        ? 'text-primary' 
                        : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="flex flex-col items-start gap-1 flex-grow min-w-0">
                    <div className="flex items-center justify-between w-full gap-2">
                      <p className="font-semibold text-gray-900 truncate">
                        {property.address}
                      </p>
                      <Badge 
                        variant="outline"
                        className={`shrink-0 rounded-lg ${getStatusColor(property.status || 'pending')}`}
                      >
                        {property.status || 'pending'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      <span className="truncate">{property.city}, {property.state}</span>
                    </div>
                  </div>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-xl"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this property?')) {
                    deletePropertyMutation(property.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {properties?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Home className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Properties Yet</h3>
              <p className="text-gray-500 max-w-sm">
                Click the plus button above to add your first property
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};