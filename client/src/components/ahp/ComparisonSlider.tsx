import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { cn, getAHPScale, getSliderValue, getComparisonDescription } from "@/lib/utils";

interface ComparisonSliderProps {
  leftItem: string;
  rightItem: string;
  value: number;
  onChange: (value: number) => void;
  colorScheme?: "primary" | "secondary";
}

export default function ComparisonSlider({
  leftItem,
  rightItem,
  value,
  onChange,
  colorScheme = "primary",
}: ComparisonSliderProps) {
  const [sliderValue, setSliderValue] = useState<number>(getSliderValue(value));

  // Update the slider value when the AHP value changes
  useEffect(() => {
    setSliderValue(getSliderValue(value));
  }, [value]);

  const handleSliderChange = (newValue: number[]) => {
    const sliderVal = newValue[0];
    setSliderValue(sliderVal);
    
    // Convert slider value to AHP scale value
    const ahpValue = getAHPScale(sliderVal);
    onChange(ahpValue);
  };

  return (
    <div className={cn(
      "border border-neutral-medium rounded-lg p-4",
      colorScheme === "secondary" ? "bg-white" : "bg-white"
    )}>
      <div className="flex justify-between items-center mb-3">
        <div className={cn(
          "font-medium",
          colorScheme === "secondary" ? "text-secondary" : "text-primary"
        )}>
          {leftItem}
        </div>
        <div className="text-sm text-neutral-dark">vs</div>
        <div className={cn(
          "font-medium",
          colorScheme === "secondary" ? "text-secondary" : "text-primary"
        )}>
          {rightItem}
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="w-1/4 text-right pr-3 text-sm">
          {leftItem} é melhor
        </div>
        <div className="w-1/2">
          <Slider
            value={[sliderValue]}
            min={1}
            max={17}
            step={1}
            onValueChange={handleSliderChange}
            className="w-full"
          />
        </div>
        <div className="w-1/4 pl-3 text-sm">
          {rightItem} é melhor
        </div>
      </div>
      
      <div className="text-center text-sm text-neutral-gray mt-2">
        {getComparisonDescription(value, leftItem, rightItem)}
      </div>
    </div>
  );
}
