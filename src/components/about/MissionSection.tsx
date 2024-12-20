import { Card, CardContent } from "@/components/ui/card";

const MissionSection = () => {
  return (
    <Card className="bg-muted/5">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-lg leading-relaxed">
          We're revolutionizing solar sales through AI-driven automation. Unlike traditional platforms with cumbersome interfaces, 
          our agentic software seamlessly traverses CRMs, communication platforms, ERM systems, and utility APIs. By leveraging 
          the richest constitution of solar data, we deliver maximum impact across sales, internal workflows, and even city planning.
        </p>
      </CardContent>
    </Card>
  );
};

export default MissionSection;