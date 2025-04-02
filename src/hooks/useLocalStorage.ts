
import { useState, useEffect } from 'react';
import { StorageManager } from '../storage/StorageManager';

/**
 * Custom hook for using localStorage with state
 */
export function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void] {
  // Get stored value
  const [storedValue, setStoredValue] = useState<T>(() => {
    return StorageManager.get<T>(key, initialValue) as T;
  });

  // Set to localStorage whenever state changes
  const setValue = (value: T | ((prevValue: T) => T)) => {
    setStoredValue((prevValue) => {
      const newValue = value instanceof Function ? value(prevValue) : value;
      StorageManager.save(key, newValue);
      return newValue;
    });
  };

  // Update state if localStorage changes in another tab
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error parsing storage value:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
