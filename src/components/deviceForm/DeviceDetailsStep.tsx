
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormValues } from './types';
import StepNavigation from './StepNavigation';
import SpecificationsCard from './SpecificationsCard';
import DeviceIdentificationFields from './DeviceIdentificationFields';
import DeviceConditionFields from './DeviceConditionFields';
import DeviceNotesFields from './DeviceNotesFields';

interface DeviceDetailsStepProps {
  onPrevious: () => void;
  onSubmit: () => void;
  setCurrentStep: (step: 'model') => void;
  suppliers: { id: string; name: string }[];
}

const DeviceDetailsStep: React.FC<DeviceDetailsStepProps> = ({ 
  onPrevious, 
  onSubmit,
  setCurrentStep,
  suppliers
}) => {
  const form = useFormContext<FormValues>();
  const model = form.watch('model');
  const color = form.watch('color');
  const storage = form.watch('storage');

  return (
    <div className="space-y-6">
      <SpecificationsCard
        model={model}
        color={color}
        storage={storage}
        onChangeSpecs={() => setCurrentStep('model')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DeviceIdentificationFields suppliers={suppliers} />
        <DeviceConditionFields />
      </div>

      <DeviceNotesFields />

      <StepNavigation 
        currentStep="details" 
        onNext={() => {}} 
        onPrevious={onPrevious} 
        onSubmit={onSubmit}
        isSubmitVisible={true}
      />
    </div>
  );
};

export default DeviceDetailsStep;
