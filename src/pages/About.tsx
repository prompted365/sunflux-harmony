import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-center mb-12">About SunLink.ai</h1>
          
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Revolutionizing Solar Design & Sales</h2>
              <p className="text-lg leading-relaxed mb-4">
                SunLink.ai is at the forefront of solar technology, combining advanced AI with precise engineering to transform how solar solutions are designed, presented, and implemented.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Intelligent Design</h3>
                <ul className="space-y-2">
                  <li>• Advanced 3D modeling and shading analysis</li>
                  <li>• Optimal panel placement algorithms</li>
                  <li>• Real-time performance simulations</li>
                  <li>• Climate-specific calculations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Financial Clarity</h3>
                <ul className="space-y-2">
                  <li>• Detailed ROI projections</li>
                  <li>• Utility savings analysis</li>
                  <li>• Available incentive calculations</li>
                  <li>• Customized financing options</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-muted/5">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-lg leading-relaxed">
                We're committed to accelerating the world's transition to sustainable energy by making solar adoption simpler, more transparent, and more accessible than ever before. Through cutting-edge technology and data-driven insights, we empower homeowners and businesses to make informed decisions about their energy future.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Accuracy</h3>
                <p>Industry-leading precision in solar analysis and financial projections</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p>Continuous advancement in AI and machine learning capabilities</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Support</h3>
                <p>Dedicated expertise throughout your solar journey</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;