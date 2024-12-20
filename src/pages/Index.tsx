import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import PropertyForm from "@/components/PropertyForm";
import SolarResults from "@/components/SolarResults";
import SunsetAnimation from "@/components/SunsetAnimation";

const Index = () => {
  return (
    <main className="min-h-screen bg-secondary">
      <Navigation />
      <Hero />
      <div className="container mx-auto px-4 py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/40 to-secondary/20 pointer-events-none" />
        <div className="relative mb-12">
          <SunsetAnimation />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/30 to-secondary pointer-events-none" />
        </div>
        <PropertyForm />
        <SolarResults />
      </div>
    </main>
  );
};

export default Index;