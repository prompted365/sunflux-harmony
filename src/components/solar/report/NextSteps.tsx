import { Card } from "@/components/ui/card";

const NextSteps = () => {
  return (
    <Card className="p-6">
      <h3 className="text-2xl font-semibold text-primary mb-4">Next Steps</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-medium text-lg mb-2">1. Schedule Consultation</h4>
          <p className="text-gray-600">
            Our solar experts will review your custom analysis and answer any questions you may have about the installation process.
          </p>
        </div>
        <div>
          <h4 className="font-medium text-lg mb-2">2. Site Assessment</h4>
          <p className="text-gray-600">
            We'll conduct a detailed on-site evaluation to finalize the design and confirm all measurements.
          </p>
        </div>
        <div>
          <h4 className="font-medium text-lg mb-2">3. Installation</h4>
          <p className="text-gray-600">
            Our certified installers will complete your solar system installation, typically within 1-2 days.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default NextSteps;