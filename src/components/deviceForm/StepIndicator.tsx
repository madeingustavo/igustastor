
import React from 'react';
import { Step } from './types';

interface StepIndicatorProps {
  currentStep: Step;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center mb-8">
      <div 
        className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium ${
          currentStep === 'model' || currentStep === 'color' || currentStep === 'storage' || currentStep === 'details' 
            ? 'bg-blue-500' : 'bg-gray-200 text-gray-500'
        }`}
      >
        1
      </div>
      <div className={`h-1 w-16 ${
        currentStep === 'color' || currentStep === 'storage' || currentStep === 'details' 
          ? 'bg-blue-500' : 'bg-gray-200'
      }`}></div>
      <div 
        className={`h-10 w-10 rounded-full flex items-center justify-center font-medium ${
          currentStep === 'color' || currentStep === 'storage' || currentStep === 'details' 
            ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
        }`}
      >
        2
      </div>
      <div className={`h-1 w-16 ${
        currentStep === 'storage' || currentStep === 'details' 
          ? 'bg-blue-500' : 'bg-gray-200'
      }`}></div>
      <div 
        className={`h-10 w-10 rounded-full flex items-center justify-center font-medium ${
          currentStep === 'storage' || currentStep === 'details' 
            ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
        }`}
      >
        3
      </div>
    </div>
  );
};

export default StepIndicator;
