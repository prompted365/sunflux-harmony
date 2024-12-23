import { Eye, EyeOff, Layers, Slider } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { LayerType, LAYER_CONFIGS } from './LayerTypes';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";

interface LayerControlsProps {
  visibleLayers: Record<LayerType, boolean>;
  onToggleLayer: (layerId: LayerType) => void;
  onOpacityChange?: (layerId: LayerType, opacity: number) => void;
}

export const LayerControls = ({
  visibleLayers,
  onToggleLayer,
  onOpacityChange
}: LayerControlsProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Layer Controls
        </CardTitle>
        <CardDescription>Toggle visibility of different data layers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(LAYER_CONFIGS).map(([id, config]) => (
            <div key={id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleLayer(id as LayerType)}
                >
                  {visibleLayers[id as LayerType] ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
                <div>
                  <p className="font-medium">{config.label}</p>
                  <p className="text-sm text-muted-foreground">{config.description}</p>
                </div>
              </div>
              {onOpacityChange && visibleLayers[id as LayerType] && (
                <div className="w-32">
                  <Slider 
                    defaultValue={[100]}
                    max={100}
                    step={1}
                    onValueChange={([value]) => {
                      onOpacityChange(id as LayerType, value / 100);
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};