
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormValues } from './types';
import StepNavigation from './StepNavigation';

interface StorageSelectionStepProps {
  onNext: () => void;
  onPrevious: () => void;
  availableStorage: string[];
}

const StorageSelectionStep: React.FC<StorageSelectionStepProps> = ({ 
  onNext, 
  onPrevious,
  availableStorage
}) => {
  const form = useFormContext<FormValues>();
  const storage = form.watch('storage');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Defina o armazenamento</h2>
      </div>
      <FormField
        control={form.control}
        name="storage"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-medium">Armazenamento *</FormLabel>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {availableStorage.map((storage) => (
                <FormItem key={storage}>
                  <FormLabel className="border rounded-md p-4 cursor-pointer hover:border-blue-500 transition-colors flex items-center justify-center h-16 w-full text-center">
                    <FormControl>
                      <RadioGroupItem value={storage} className="sr-only" />
                    </FormControl>
                    <span className={field.value === storage ? "font-bold text-blue-500" : ""}>
                      {storage}
                    </span>
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
            <FormMessage />
          </FormItem>
        )}
      />
      <StepNavigation 
        currentStep="storage" 
        onNext={onNext} 
        onPrevious={onPrevious} 
        isNextDisabled={!storage} 
      />
    </div>
  );
};

export default StorageSelectionStep;
