import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageItemProps {
  url: string;
  title: string;
  isLoading?: boolean;
}

export const ImageItem = ({ url, title, isLoading = false }: ImageItemProps) => {
  if (isLoading) {
    return (
      <Card className="p-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-4 w-24 mt-2" />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img 
          src={url} 
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
    </Card>
  );
};