import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Plus, Trash2, Home, MapPin } from "lucide-react";
import { Property } from "../types";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PropertySubmissionForm } from "../PropertySubmissionForm";
import { Card } from "@/components/ui/card";

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
        return 'bg-primary/90 text-primary-foreground border-primary/20';
      case 'processing':
        return 'bg-secondary/90 text-secondary-foreground border-secondary/20';
      case 'error':
        return 'bg-destructive/90 text-destructive-foreground border-destructive/20';
      default:
        return 'bg-muted/90 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="relative">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-4">
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
        <div className="grid grid-cols-1 gap-4 p-6">
          {properties?.map((property) => (
            <Card
              key={property.id}
              className={`transition-all duration-200 ${
                selectedPropertyId === property.id 
                  ? 'ring-2 ring-primary/20 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between p-4">
                <Button
                  variant="ghost"
                  className="flex-1 h-auto p-2 justify-start hover:bg-transparent"
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
                          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${getStatusColor(property.status || 'pending')}`}
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
                  className="flex-shrink-0 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-xl ml-2"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this property?')) {
                      deletePropertyMutation(property.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
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