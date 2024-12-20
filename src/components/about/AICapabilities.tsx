import { Card, CardContent } from "@/components/ui/card";
import { Brain, Workflow, LineChart } from "lucide-react";

const AICapabilities = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center mb-8">AI-Driven Innovation</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Intelligent Automation</h3>
            <p>Advanced AI agents that learn and adapt to your business processes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <Workflow className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Process Optimization</h3>
            <p>Continuous workflow improvement through machine learning</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <LineChart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Predictive Analytics</h3>
            <p>Data-driven insights for better decision making</p>
          </CardContent>
        </Card>
      </div>
    </Card>
  );
};

export default AICapabilities;