import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import PropertyForm from "@/components/PropertyForm";

const Index = () => {
  return (
    <main className="min-h-screen bg-secondary">
      <Navigation />
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <PropertyForm />
      </div>
    </main>
  );
};

export default Index;