import { Mail, Phone, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background pt-24">
      <Navigation />
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">Get in Touch</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Ready to transform your solar business? Our team is here to help you succeed.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <Mail className="w-5 h-5 text-primary" />
              <a href="mailto:contact@sunlink.ai" className="text-primary hover:underline">
                contact@sunlink.ai
              </a>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <Phone className="w-5 h-5 text-primary" />
              <a href="tel:+1234567890" className="text-primary hover:underline">
                (123) 456-7890
              </a>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <Building className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">
                123 Solar Street, Sunshine City, SC 12345
              </span>
            </div>
            
            <Button 
              className="bg-primary hover:bg-primary/90 text-white mt-8"
              onClick={() => window.location.href = 'mailto:contact@sunlink.ai'}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
