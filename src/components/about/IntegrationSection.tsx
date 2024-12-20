import { Card, CardContent } from "@/components/ui/card";
import { Network, MessageSquare, Building2, Zap } from "lucide-react";

const IntegrationSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center mb-8">Intelligent System Integration</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Network className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Seamless CRM Integration</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Automatic data synchronization across platforms</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Real-time lead enrichment and scoring</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Intelligent workflow automation</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Communication Hub</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>AI-powered response generation</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Multi-channel engagement tracking</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Automated follow-up sequences</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Enterprise Systems</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>ERM system integration</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Resource optimization</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Compliance automation</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Utility Integration</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Real-time rate analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Usage pattern optimization</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Incentive program tracking</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntegrationSection;