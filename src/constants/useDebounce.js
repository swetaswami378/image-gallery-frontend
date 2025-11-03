import { useState, useEffect } from "react";

/**
 * useDebounce
 * @param value - The value to debounce (e.g., search input)
 * @param delay - The delay time in ms (default: 500ms)
 * @returns debouncedValue
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup timeout if value changes before delay finishes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
