import { Card } from "@/components/ui/card";

interface BuildingAnalysisProps {
  solarPotential: any;
}

const BuildingAnalysis = ({ solarPotential }: BuildingAnalysisProps) => {
  return (
    <>
      <Card className="p-6 mb-6">
        <h3 className="font-semibold mb-4">Building Analysis Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Roof Complexity</p>
            <p className="font-medium">{solarPotential.roofSegmentStats.length} Segments</p>
            <p className="text-xs text-gray-500 mt-1">
              Pitch Consistency: {getPitchConsistencyRating(solarPotential.roofSegmentStats)}
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Average Measurements</p>
            <p className="font-medium">
              {getAveragePitch(solarPotential.roofSegmentStats).toFixed(1)}° Pitch
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {getAverageHeight(solarPotential.roofSegmentStats).toFixed(1)}m Height
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Optimal Orientation</p>
            <p className="font-medium capitalize">
              {getOptimalOrientation(solarPotential.roofSegmentStats)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {countSouthFacingSegments(solarPotential.roofSegmentStats)} South-facing segments
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Roof Segment Analysis</h3>
        <div className="space-y-4">
          {solarPotential.roofSegmentStats.slice(0, 6).map((segment: any, index: number) => (
            <div key={index} className="border-b pb-4">
              <h4 className="font-medium">Segment {index + 1}</h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Area</p>
                  <p className="font-medium">{segment.stats.areaMeters2.toFixed(1)} m²</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pitch</p>
                  <p className="font-medium">{segment.pitchDegrees.toFixed(1)}°</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Azimuth</p>
                  <p className="font-medium">{segment.azimuthDegrees.toFixed(1)}°</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Height</p>
                  <p className="font-medium">{segment.planeHeightAtCenterMeters.toFixed(1)} m</p>
                </div>
              </div>
            </div>
          ))}
          {solarPotential.roofSegmentStats.length > 6 && (
            <p className="text-sm text-muted-foreground text-center">
              +{solarPotential.roofSegmentStats.length - 6} more segments
            </p>
          )}
        </div>
      </Card>
    </>
  );
};

// Helper functions
function getPitchConsistencyRating(segments: any[]): string {
  const avgPitch = getAveragePitch(segments);
  const variance = segments.reduce((acc, segment) => 
    acc + Math.pow(segment.pitchDegrees - avgPitch, 2), 0) / segments.length;
  return variance < 5 ? "High" : variance < 15 ? "Medium" : "Low";
}

function getAveragePitch(segments: any[]): number {
  return segments.reduce((acc, segment) => 
    acc + segment.pitchDegrees, 0) / segments.length;
}

function getAverageHeight(segments: any[]): number {
  return segments.reduce((acc, segment) => 
    acc + segment.planeHeightAtCenterMeters, 0) / segments.length;
}

function getOptimalOrientation(segments: any[]): string {
  const orientations = segments.reduce((acc: any, segment) => {
    const azimuth = segment.azimuthDegrees;
    if (azimuth > 315 || azimuth <= 45) acc.north++;
    else if (azimuth > 45 && azimuth <= 135) acc.east++;
    else if (azimuth > 135 && azimuth <= 225) acc.south++;
    else acc.west++;
    return acc;
  }, { north: 0, east: 0, south: 0, west: 0 });

  return Object.entries(orientations)
    .reduce((a, b) => a[1] > b[1] ? a : b)[0];
}

function countSouthFacingSegments(segments: any[]): number {
  return segments.filter(segment => 
    segment.azimuthDegrees > 135 && segment.azimuthDegrees <= 225
  ).length;
}

export default BuildingAnalysis;