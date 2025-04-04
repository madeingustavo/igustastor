
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormValues } from './types';
import StepNavigation from './StepNavigation';

interface ColorSelectionStepProps {
  onNext: () => void;
  onPrevious: () => void;
  availableColors: string[];
}

const ColorSelectionStep: React.FC<ColorSelectionStepProps> = ({ 
  onNext, 
  onPrevious,
  availableColors
}) => {
  const form = useFormContext<FormValues>();
  const color = form.watch('color');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Escolha a cor</h2>
      </div>
      <FormField
        control={form.control}
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-medium">Cor *</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableColors.map((color) => (
                <div 
                  key={color}
                  className={`border rounded-md p-4 cursor-pointer hover:border-blue-500 transition-colors ${
                    field.value === color ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => field.onChange(color)}
                >
                  <div className="flex items-center">
                    <div className={`h-6 w-6 rounded-full mr-2 border ${
                      field.value === color ? 'border-blue-500' : 'border-gray-300'
                    }`}>
                      {field.value === color && (
                        <div className="h-full w-full rounded-full bg-blue-500 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                    <span>{color}</span>
                  </div>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <StepNavigation 
        currentStep="color" 
        onNext={onNext} 
        onPrevious={onPrevious} 
        isNextDisabled={!color} 
      />
    </div>
  );
};

export default ColorSelectionStep;
