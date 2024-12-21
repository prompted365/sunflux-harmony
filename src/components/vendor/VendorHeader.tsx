import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const VendorHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-4">
      <Button
        variant="outline"
        onClick={() => navigate("/")}
        className="mb-4"
      >
        Back to Home
      </Button>
    </div>
  );
};