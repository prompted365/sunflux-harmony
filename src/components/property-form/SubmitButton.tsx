import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  loading: boolean;
  calculating: boolean;
}

const SubmitButton = ({ loading, calculating }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-primary hover:bg-primary/90"
      disabled={loading || calculating}
    >
      {loading ? "Submitting..." : calculating ? "Calculating Solar Potential..." : "Submit Property"}
    </Button>
  );
};

export default SubmitButton;