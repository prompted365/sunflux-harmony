import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const NextSteps = () => {
  const steps = [
    {
      title: "Review Your Custom Solar Plan",
      description: "Examine the detailed analysis of your property's solar potential and financial benefits."
    },
    {
      title: "Schedule a Consultation",
      description: "Connect with our solar experts to discuss your customized installation plan and address any questions."
    },
    {
      title: "Site Assessment",
      description: "Our team will conduct a detailed on-site evaluation to finalize the installation plan."
    },
    {
      title: "Installation & Activation",
      description: "Professional installation of your solar system, followed by utility connection and system activation."
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-2xl font-semibold text-primary mb-6">Next Steps</h3>
      
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{step.title}</h4>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NextSteps;