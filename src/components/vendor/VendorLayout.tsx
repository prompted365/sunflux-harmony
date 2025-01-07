import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { VendorSidebar } from "./VendorSidebar";
import { VendorHeader } from "./VendorHeader";

interface VendorLayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const VendorLayout = ({ children, activeSection, onSectionChange }: VendorLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-4rem)] w-full">
          <VendorSidebar 
            activeSection={activeSection} 
            onSectionChange={onSectionChange} 
          />
          <main className="flex-1 overflow-auto">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <VendorHeader />
              <div className="mt-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};