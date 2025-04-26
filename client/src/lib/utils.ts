import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, precision = 2): string {
  return num.toFixed(precision);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function generatePairs<T>(items: T[]): [T, T][] {
  const pairs: [T, T][] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      pairs.push([items[i], items[j]]);
    }
  }
  return pairs;
}

export function getAHPScale(value: number): number {
  // AHP scale: 1/9, 1/7, 1/5, 1/3, 1, 3, 5, 7, 9
  // Input range: 1-17 (slider value)
  // Middle point (9) corresponds to equal importance (1 in AHP scale)
  
  if (value === 9) return 1; // Equal importance
  
  if (value < 9) {
    // Left side of the scale (1-8)
    const scaleValues = [9, 7, 5, 3, 1/1, 1/3, 1/5, 1/7, 1/9];
    return scaleValues[9 - value];
  } else {
    // Right side of the scale (10-17)
    const scaleValues = [1/9, 1/7, 1/5, 1/3, 1/1, 3, 5, 7, 9];
    return scaleValues[value - 9];
  }
}

export function getSliderValue(ahpValue: number): number {
  // Convert AHP scale value to slider value (1-17)
  if (ahpValue === 1) return 9; // Equal importance
  
  if (ahpValue > 1) {
    // Right side of slider
    switch (ahpValue) {
      case 3: return 13;
      case 5: return 15;
      case 7: return 16;
      case 9: return 17;
      default: return 9;
    }
  } else {
    // Left side of slider
    switch (ahpValue) {
      case 1/3: return 5;
      case 1/5: return 3;
      case 1/7: return 2;
      case 1/9: return 1;
      default: return 9;
    }
  }
}

export function formatAHPValue(value: number): string {
  // Format the AHP value for display
  if (value === 1) return "1";
  if (value > 1) return value.toString();
  return `1/${Math.round(1/value)}`;
}

export function getComparisonDescription(value: number, item1: string, item2: string): string {
  if (value === 1) {
    return `Ambos são igualmente importantes`;
  } else if (value > 1) {
    return `${item1} é ${formatAHPValue(value)}x mais importante que ${item2}`;
  } else {
    return `${item2} é ${formatAHPValue(1/value)}x mais importante que ${item1}`;
  }
}
