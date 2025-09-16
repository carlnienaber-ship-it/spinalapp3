import { useState, useEffect } from 'react';

/**
 * A custom hook that syncs a state value with localStorage.
 * It updates the in-memory state instantly for a responsive UI,
 * but debounces the write to localStorage to prevent performance issues.
 * @param key The key to use in localStorage.
 * @param initialValue The initial value to use if nothing is in localStorage.
 * @param debounceMs The debounce delay in milliseconds.
 * @returns A stateful value, and a function to update it.
 */
export function useLocalStorage<T>(key: string, initialValue: T, debounceMs = 500) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) as T : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // useEffect to update localStorage when the state changes
  useEffect(() => {
    // Debounce the save operation
    const handler = setTimeout(() => {
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
          console.error(`Error setting localStorage key "${key}":`, error);
        }
      }
    }, debounceMs);

    // Cleanup the timeout if the value changes before the delay is over
    return () => {
      clearTimeout(handler);
    };
  }, [key, storedValue, debounceMs]);

  return [storedValue, setStoredValue] as const;
}
