import { Card } from "@/components/ui/card";
import { ImageItemProps } from "./types";

export const ImageItem = ({ url, title }: ImageItemProps) => (
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