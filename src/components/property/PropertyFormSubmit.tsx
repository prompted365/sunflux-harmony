import { Button } from "@/components/ui/button"

interface PropertyFormSubmitProps {
  loading: boolean
  calculating: boolean
}

export const PropertyFormSubmit = ({ loading, calculating }: PropertyFormSubmitProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-primary hover:bg-primary/90 py-6 text-lg mt-6"
      disabled={loading || calculating}
    >
      {loading ? "Creating Account..." : calculating ? "Calculating Solar Potential..." : "Create Trial Account & Analyze Property"}
    </Button>
  )
}