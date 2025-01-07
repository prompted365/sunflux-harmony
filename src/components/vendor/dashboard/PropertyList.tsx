import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Home, MapPin } from "lucide-react";
import { Property } from "../types";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const deleteProperty = useMutation(async (id: string) => {
  await supabase.from('properties').delete().eq('id', id);
  toast.success('Property deleted successfully');
});

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500 text-white';
    case 'inactive':
      return 'bg-red-500 text-white';
    default:
      return 'bg-yellow-500 text-white';
  }
};

export const PropertyList = ({
  properties,
  selectedPropertyId,
  onSelectProperty,
}: {
  properties: Property[] | undefined;
  selectedPropertyId: string | null;
  onSelectProperty: (id: string) => void;
}) => {
  const queryClient = useQueryClient();

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4 p-1">
        {properties?.map((property) => (
          <div
            key={property.id}
            className="flex items-center gap-2"
          >
            <Button
              variant={selectedPropertyId === property.id ? "default" : "outline"}
              className={`w-full justify-start transition-all duration-200 rounded-xl p-4 ${
                selectedPropertyId === property.id 
                  ? 'shadow-md bg-primary/10 hover:bg-primary/20' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onSelectProperty(property.id)}
            >
              <div className="flex items-center w-full">
                <div className="mr-4">
                  <Home className="h-5 w-5 text-primary/70" />
                </div>
                <div className="flex flex-col items-start gap-2 flex-grow">
                  <div className="flex items-center justify-between w-full">
                    <p className="font-semibold text-gray-800">{property.address}</p>
                    <Badge 
                      variant="outline"
                      className={`ml-2 rounded-lg ${getStatusColor(property.status)}`}
                    >
                      {property.status || 'pending'}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1.5" />
                    {property.city}, {property.state}
                  </div>
                </div>
              </div>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10 transition-colors rounded-xl"
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
