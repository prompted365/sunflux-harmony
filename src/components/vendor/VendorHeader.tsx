import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const VendorHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        onClick={() => navigate("/")}
        className="text-sm"
      >
        Back to Home
      </Button>
    </div>
  );
};