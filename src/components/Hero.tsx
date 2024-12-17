import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-secondary/10 to-background pt-24 overflow-hidden">
      {/* Solar Animation Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-energy-pattern opacity-20 animate-sun-ray" />
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-energy-pattern opacity-10 animate-solar-pulse" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="relative">
          {/* Main Content Roll */}
          <div className="bg-gradient-to-br from-white via-white to-muted/10 backdrop-blur-lg rounded-xl shadow-xl p-8 mb-12 animate-roll-down origin-top">
            <div className="inline-block p-2 bg-solar-gradient rounded-lg text-white text-sm font-medium mb-6">
              Empower Solar Businesses
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-muted mb-6">
              Accelerate Your Solar Sales
              <span className="text-primary block mt-2">With Digital Innovation</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Streamline your solar sales process with our comprehensive platform. From lead management to final installation, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg group relative overflow-hidden"
              >
                <span className="relative z-10">Start Free Trial</span>
                <div className="absolute inset-0 bg-solar-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Feature Roll */}
          <div className="bg-gradient-to-br from-white via-white to-muted/10 backdrop-blur-lg rounded-xl shadow-xl p-8 mb-12 animate-roll-down animation-delay-500 origin-top">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4 p-6 rounded-lg transition-all duration-300 hover:bg-secondary/10">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-muted">Instant Calculations</h3>
                <p className="text-gray-600">Get accurate solar potential calculations in seconds using advanced algorithms.</p>
              </div>
              
              <div className="space-y-4 p-6 rounded-lg transition-all duration-300 hover:bg-secondary/10">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-muted">Automated Reports</h3>
                <p className="text-gray-600">Generate professional PDF reports with just one click.</p>
              </div>
              
              <div className="space-y-4 p-6 rounded-lg transition-all duration-300 hover:bg-secondary/10">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-muted">Lead Management</h3>
                <p className="text-gray-600">Integrated CRM system for efficient lead tracking and nurturing.</p>
              </div>
            </div>
          </div>

          {/* Power Message Section with Image */}
          <div className="bg-muted rounded-xl shadow-xl p-8 animate-roll-down animation-delay-500 origin-top overflow-hidden">
            <div className="flex flex-col items-center justify-center space-y-8">
              <img 
                src="/lovable-uploads/2cfeccee-4491-438a-a3a9-8be759cc9534.png"
                alt="Putting power back into your hands"
                className="w-full max-w-3xl mx-auto animate-fade-in"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;