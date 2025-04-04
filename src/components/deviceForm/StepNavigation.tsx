
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Step } from './types';

interface StepNavigationProps {
  currentStep: Step;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isNextDisabled?: boolean;
  isPreviousVisible?: boolean;
  isSubmitVisible?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ 
  currentStep, 
  onPrevious, 
  onNext, 
  onSubmit,
  isNextDisabled = false,
  isPreviousVisible = true,
  isSubmitVisible = false
}) => {
  const renderPreviousButton = () => {
    if (!isPreviousVisible) return null;
    
    let label = 'Voltar';
    
    if (currentStep === 'color') {
      label = 'Voltar para seleção de modelo';
    } else if (currentStep === 'storage') {
      label = 'Voltar para seleção de cor';
    } else if (currentStep === 'details') {
      label = 'Voltar para seleção de armazenamento';
    }
    
    return (
      <Button variant="outline" onClick={onPrevious}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {label}
      </Button>
    );
  };

  const renderNextButton = () => {
    if (isSubmitVisible) {
      return (
        <Button type="submit" onClick={onSubmit}>
          Adicionar Dispositivo
        </Button>
      );
    }
    
    return (
      <Button onClick={onNext} disabled={isNextDisabled}>
        Próximo
      </Button>
    );
  };

  return (
    <div className="flex justify-between mt-8">
      {renderPreviousButton()}
      {renderNextButton()}
    </div>
  );
};

export default StepNavigation;
