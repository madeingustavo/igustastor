
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { FormValues } from './types';

const DeviceNotesFields: React.FC = () => {
  const form = useFormContext<FormValues>();
  
  return (
    <>
      <FormField
        control={form.control}
        name="has_apple_warranty"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2 space-y-0 mt-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="font-normal">Possui garantia da Apple</FormLabel>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Adicione observações sobre o dispositivo"
                className="resize-none h-32"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default DeviceNotesFields;
