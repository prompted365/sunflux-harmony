import { Input } from "@/components/ui/input"

interface AddressInputProps {
  value: string
  onChange: (value: string) => void
  label: string
  id: string
  placeholder: string
}

export const AddressInput = ({ value, onChange, label, id, placeholder }: AddressInputProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <Input
        id={id}
        type="text"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/80"
        placeholder={placeholder}
      />
    </div>
  )
}