import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface ImageryTabProps {
  propertyId: string;
}

const ImageryTab = ({ propertyId }: ImageryTabProps) => {
  const { data: property } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: images, isLoading, error } = useQuery({
    queryKey: ['property-images', propertyId],
    enabled: !!propertyId && property?.status === 'completed',
    queryFn: async () => {
      // List all files in the property's folder
      const { data: folders, error: folderError } = await supabase
        .storage
        .from('property-images')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (folderError) throw folderError;
      console.log('Available folders:', folders?.map(f => f.name));

      // Find all folders that start with our property ID
      const matchingFolders = folders?.filter(f => f.name.startsWith(propertyId)) || [];
      console.log('Matching folders:', matchingFolders);

      if (matchingFolders.length === 0) {
        console.log('No folder found for property:', propertyId);
        return [];
      }

      // Sort folders by timestamp (descending) and take the most recent one
      const sortedFolders = matchingFolders.sort((a, b) => {
        const aTimestamp = parseInt(a.name.split('_')[1] || '0');
        const bTimestamp = parseInt(b.name.split('_')[1] || '0');
        return bTimestamp - aTimestamp;
      });

      const mostRecentFolder = sortedFolders[0];
      console.log('Using most recent folder:', mostRecentFolder.name);

      // List files in the most recent property folder
      const { data: files, error: filesError } = await supabase
        .storage
        .from('property-images')
        .list(mostRecentFolder.name);

      if (filesError) throw filesError;
      console.log('Files found in folder:', files);

      // Get signed URLs for each file
      const signedUrls = await Promise.all(
        (files || []).map(async (file) => {
          const { data: { signedUrl } } = await supabase
            .storage
            .from('property-images')
            .createSignedUrl(`${mostRecentFolder.name}/${file.name}`, 3600);

          // Determine image type from filename
          const type = file.name.split('_')[0].toLowerCase();
          const fileExtension = file.name.split('.').pop()?.toLowerCase();
          
          return {
            name: file.name,
            url: signedUrl,
            type,
            displayName: getDisplayName(type),
            contentType: getContentType(fileExtension || '')
          };
        })
      );

      return signedUrls;
    },
  });

  const getDisplayName = (type: string) => {
    const displayNames: Record<string, string> = {
      rgb: 'Satellite View',
      annualflux: 'Annual Solar Analysis',
      monthlyflux: 'Monthly Solar Analysis',
      mask: 'Roof Mask Analysis',
      dsm: 'Surface Model'
    };
    return displayNames[type] || type;
  };

  const getContentType = (extension: string) => {
    const contentTypes: Record<string, string> = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif'
    };
    return contentTypes[extension] || 'image/png';
  };

  if (property?.status !== 'completed') {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Solar imagery is being processed. This may take a few minutes.
          Current status: {property?.status || 'initializing'}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>Failed to load imagery: {error.message}</AlertDescription>
    </Alert>;
  }

  if (!images?.length) {
    return <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        No imagery is available yet for this property. 
        The system is still processing the solar analysis.
      </AlertDescription>
    </Alert>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {images.map((image, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="aspect-video relative">
            <img
              src={image.url}
              alt={`Solar analysis - ${image.displayName}`}
              className="absolute inset-0 w-full h-full object-cover"
              type={image.contentType}
            />
          </div>
          <div className="p-4">
            <p className="text-sm font-medium">{image.displayName}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ImageryTab;