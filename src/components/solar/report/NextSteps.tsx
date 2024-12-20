import { Card } from "@/components/ui/card";

const NextSteps = () => {
  const currentYear = new Date().getFullYear();
  const incentives = [
    {
      name: "Federal Solar Tax Credit",
      amount: "30%",
      expiry: `${currentYear + 1}`
    },
    {
      name: "State Solar Incentive",
      amount: "$1,000",
      expiry: `${currentYear}`
    },
    {
      name: "Utility Rebate Program",
      amount: "$500",
      expiry: "Limited Time"
    }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 via-background to-background border-2">
      <h3 className="text-2xl font-semibold text-primary mb-4">Next Steps</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2 text-primary-foreground">Available Incentives</h4>
          <div className="grid gap-4 md:grid-cols-3">
            {incentives.map((incentive, index) => (
              <div key={index} className="p-3 rounded-lg bg-secondary/50">
                <p className="font-semibold text-primary">{incentive.name}</p>
                <p className="text-lg font-bold text-green-600">{incentive.amount}</p>
                <p className="text-sm text-primary-foreground">Expires: {incentive.expiry}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-primary-foreground">Implementation Timeline</h4>
          <ol className="list-decimal list-inside space-y-2 text-primary-foreground">
            <li>Schedule a detailed site assessment</li>
            <li>Receive your custom installation plan</li>
            <li>Review financing options</li>
            <li>Begin your journey to energy independence</li>
          </ol>
        </div>

        <div className="bg-primary/5 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-primary-foreground">System Expansion Options</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-primary-foreground">
            <li>Battery storage integration ready</li>
            <li>EV charger compatibility</li>
            <li>Smart home system integration</li>
            <li>Additional panel capacity available</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default NextSteps;