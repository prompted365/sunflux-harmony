import { Building2, Home, Palette, Settings, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface VendorSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const VendorSidebar = ({ activeSection, onSectionChange }: VendorSidebarProps) => {
  const menuItems = [
    { id: "dashboard", title: "Dashboard", icon: Home },
    { id: "branding", title: "Branding", icon: Palette },
    { id: "inputs", title: "Vendor Inputs", icon: Settings },
    { id: "clients", title: "Clients", icon: Users },
  ];

  return (
    <Sidebar className="pt-16">
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
                  onClick={() => onSectionChange(item.id)}
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
  );
};