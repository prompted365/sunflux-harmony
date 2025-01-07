import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Home, MapPin } from "lucide-react";
import { Property } from "../types";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PropertyListProps {
  properties: Property[] | null;
  selectedPropertyId: string | null;
  onSelectProperty: (id: string) => void;
}

export const PropertyList = ({ 
  properties, 
  selectedPropertyId, 
  onSelectProperty 
}: PropertyListProps) => {
  const queryClient = useQueryClient();

  const deleteProperty = useMutation({
    mutationFn: async (propertyId: string) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);
      
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

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 hover:bg-green-600';
      case 'processing':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'error':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-3">
        {properties?.map((property) => (
          <div
            key={property.id}
            className="flex items-center space-x-2"
          >
            <Button
              variant={selectedPropertyId === property.id ? "default" : "outline"}
              className={`w-full justify-start transition-all duration-200 ${
                selectedPropertyId === property.id 
                  ? 'shadow-md bg-primary/10 hover:bg-primary/20' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onSelectProperty(property.id)}
            >
              <div className="flex items-center w-full">
                <div className="mr-3">
                  <Home className="h-5 w-5 text-primary/70" />
                </div>
                <div className="flex flex-col items-start gap-1 flex-grow">
                  <div className="flex items-center justify-between w-full">
                    <p className="font-semibold text-gray-800">{property.address}</p>
                    <Badge 
                      variant="outline"
                      className={`ml-2 ${getStatusColor(property.status)}`}
                    >
                      {property.status || 'pending'}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {property.city}, {property.state}
                  </div>
                </div>
              </div>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10 transition-colors"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this property?')) {
                  deleteProperty.mutate(property.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};