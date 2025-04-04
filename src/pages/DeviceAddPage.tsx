
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';
import { useSuppliers } from '../hooks/useSuppliers';
import { Step } from '../components/deviceForm/types';
import StepIndicator from '../components/deviceForm/StepIndicator';
import ModelSelectionStep from '../components/deviceForm/ModelSelectionStep';
import ColorSelectionStep from '../components/deviceForm/ColorSelectionStep';
import StorageSelectionStep from '../components/deviceForm/StorageSelectionStep';
import DeviceDetailsStep from '../components/deviceForm/DeviceDetailsStep';
import { useDeviceForm } from '../hooks/useDeviceForm';

const DeviceAddPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { suppliers } = useSuppliers();
  
  // Use our custom hook for form state management
  const { 
    form, 
    currentStep, 
    setCurrentStep,
    availableColors,
    availableStorage,
    nextStep,
    prevStep,
    onSubmit
  } = useDeviceForm({ deviceId: id });

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'model':
        return <ModelSelectionStep onNext={nextStep} />;
      case 'color':
        return <ColorSelectionStep onNext={nextStep} onPrevious={prevStep} availableColors={availableColors} />;
      case 'storage':
        return <StorageSelectionStep onNext={nextStep} onPrevious={prevStep} availableStorage={availableStorage} />;
      case 'details':
        return (
          <DeviceDetailsStep 
            onPrevious={prevStep} 
            onSubmit={form.handleSubmit(onSubmit)} 
            setCurrentStep={setCurrentStep}
            suppliers={suppliers}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4 p-2" 
            onClick={() => navigate('/devices')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Novo iPhone</h1>
        </div>
        
        <FormProvider {...form}>
          <Form {...form}>
            <form className="space-y-8">
              <StepIndicator currentStep={currentStep} />
              {renderStepContent()}
            </form>
          </Form>
        </FormProvider>
      </div>
    </Layout>
  );
};

export default DeviceAddPage;
