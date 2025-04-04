
import { useState, useEffect, useCallback } from 'react';
import { StorageManager } from '../storage/StorageManager';
import { toast } from 'sonner';

/**
 * Custom hook for using localStorage with state
 * @param key Storage key
 * @param initialValue Initial value for state
 * @returns [storedValue, setValue] - current value and setter function
 */
export function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void] {
  // State for the stored value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      return StorageManager.get<T>(key, initialValue) as T;
    } catch (error) {
      console.error(`Error getting stored value for ${key}:`, error);
      toast.error(`Erro ao carregar dados de ${key}`);
      return initialValue;
    }
  });

  // Function to update localStorage and state
  const setValue = useCallback((value: T | ((prevValue: T) => T)) => {
    try {
      setStoredValue((prevValue) => {
        const newValue = value instanceof Function ? value(prevValue) : value;
        StorageManager.save(key, newValue);
        return newValue;
      });
    } catch (error) {
      console.error(`Error storing value for ${key}:`, error);
      toast.error(`Erro ao salvar dados de ${key}`);
    }
  }, [key]);

  // Update state if localStorage changes in another tab/window
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing storage value for ${key}:`, error);
        }
      }
    };

    // Add event listener
    window.addEventListener('storage', handleStorageChange);
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
