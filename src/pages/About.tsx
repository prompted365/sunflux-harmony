import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import SunAnimation from "@/components/SunAnimation";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">About SunLink.ai</h1>
            <div className="relative">
              <SunAnimation />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background pointer-events-none" />
            </div>
          </div>
          
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

          {/* New Section: Value Proposition for Solar Vendors */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-8">Empower Your Solar Business</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Lead Generation & Conversion</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Automated lead qualification with AI-powered assessment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Interactive 3D visualizations that boost client engagement</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Instant proposal generation with customizable templates</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Smart follow-up reminders and engagement tracking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Sales Acceleration</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Reduce sales cycle by up to 50% with automated workflows</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Real-time competitive analysis and pricing optimization</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Integration with major CRM platforms for seamless workflow</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Mobile-first design for on-the-go sales teams</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Customer Success Stories</h3>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-primary">45%</p>
                    <p className="text-sm mt-1">Increase in Lead Conversion</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">2x</p>
                    <p className="text-sm mt-1">Faster Proposal Generation</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">30%</p>
                    <p className="text-sm mt-1">Higher Close Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Enterprise Solutions</h3>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Scale your solar business with our enterprise-grade platform, featuring:
                  </p>
                  <ul className="grid md:grid-cols-2 gap-4">
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      Custom API integrations
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      White-label solutions
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      Advanced analytics dashboard
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      Team performance tracking
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      Bulk proposal generation
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      Priority support
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;