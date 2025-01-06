import { Card } from "@/components/ui/card";
import { ProcessedImage } from "../utils/imageProcessing";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

interface ImageryCardProps {
  image: ProcessedImage;
}

const ImageryCard = ({ image }: ImageryCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.error('Failed to load image:', image.url);
    setImageError(true);
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Image unavailable</p>
            </div>
          </div>
        ) : (
          <img
            src={image.url}
            alt={`Solar analysis - ${image.displayName}`}
            className="absolute inset-0 w-full h-full object-cover"
            onError={handleImageError}
          />
        )}
      </div>
      <div className="p-4">
        <p className="text-sm font-medium">{image.displayName}</p>
      </div>
    </Card>
  );
};

export default ImageryCard;