
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IPHONE_MODELS } from '../../utils/deviceConstants';
import { FormValues } from './types';
import StepNavigation from './StepNavigation';

interface ModelSelectionStepProps {
  onNext: () => void;
}

const ModelSelectionStep: React.FC<ModelSelectionStepProps> = ({ onNext }) => {
  const form = useFormContext<FormValues>();
  const model = form.watch('model');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Selecione o modelo</h2>
      </div>
      <FormField
        control={form.control}
        name="model"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-medium">Modelo do iPhone *</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                // Reset color and storage when model changes
                form.setValue('color', '');
                form.setValue('storage', '');
              }} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-80">
                {IPHONE_MODELS.map((model) => (
                  <SelectItem key={model} value={model}>{model}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <StepNavigation 
        currentStep="model" 
        onNext={onNext} 
        onPrevious={() => {}} 
        isNextDisabled={!model}
        isPreviousVisible={false} 
      />
    </div>
  );
};

export default ModelSelectionStep;
