import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  placeholder: string;
  items: string[];
  className?: string;
  onChange: (value: string) => void; // Callback function for selection change
}

export default function FilterSelected({ placeholder, items, className, onChange }: Props) {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger
        className={`h-10 bg-green-900 border-none focus:border-transparent focus:ring-0 focus:outline-none rounded-none text-gray-100 ${className}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
