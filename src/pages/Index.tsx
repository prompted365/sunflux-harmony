import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import PropertyForm from "@/components/PropertyForm";
import SolarResults from "@/components/SolarResults";

const Index = () => {
  return (
    <main className="min-h-screen bg-secondary">
      <Navigation />
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <PropertyForm />
        <SolarResults />
      </div>
    </main>
  );
};

export default Index;