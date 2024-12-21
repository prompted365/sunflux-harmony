import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Building2, Home, Palette, Settings, Users } from "lucide-react";
import VendorBranding from "@/components/vendor/VendorBranding";
import VendorInputs from "@/components/vendor/VendorInputs";
import VendorClients from "@/components/vendor/VendorClients";
import VendorDashboard from "@/components/vendor/VendorDashboard";

const Vendor = () => {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vendorProfile, setVendorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }

        const { data, error } = await supabase
          .from("vendor_profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (error) {
          toast({
            title: "Error fetching vendor profile",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        // If no profile exists, create one
        if (!data) {
          const { data: newProfile, error: createError } = await supabase
            .from("vendor_profiles")
            .insert([{ id: session.user.id }])
            .select()
            .single();

          if (createError) {
            toast({
              title: "Error creating vendor profile",
              description: createError.message,
              variant: "destructive",
            });
            return;
          }

          setVendorProfile(newProfile);
        } else {
          setVendorProfile(data);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProfile();
  }, [navigate, toast]);

  const menuItems = [
    { id: "dashboard", title: "Dashboard", icon: Home },
    { id: "branding", title: "Branding", icon: Palette },
    { id: "inputs", title: "Vendor Inputs", icon: Settings },
    { id: "clients", title: "Clients", icon: Users },
  ];

  const renderContent = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    switch (activeSection) {
      case "dashboard":
        return <VendorDashboard />;
      case "branding":
        return <VendorBranding vendorProfile={vendorProfile} />;
      case "inputs":
        return <VendorInputs />;
      case "clients":
        return <VendorClients />;
      default:
        return <VendorDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-4rem)] w-full">
          <Sidebar className="pt-16"> {/* Added padding-top here */}
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>
                  <Building2 className="mr-2 h-4 w-4" />
                  Vendor Portal
                </SidebarGroupLabel>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        className={activeSection === item.id ? "bg-primary/10" : ""}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 p-6 pt-16"> {/* Added padding-top here too */}
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="mb-4"
              >
                Back to Home
              </Button>
            </div>
            {renderContent()}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Vendor;