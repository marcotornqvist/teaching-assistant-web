'use client';

import Step1, { Step1FormData } from 'components/task/Step1';
import React from 'react';
import Step2 from 'components/task/Step2';

export type Step = 1 | 2;

export type StepProps = {
  step: Step;
  formData: Step1FormData;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setStep: (step: Step) => void;
  setFormData: React.Dispatch<React.SetStateAction<Step1FormData>>;
};

const Steps = ({
  step,
  isLoading,
  formData,
  setStep,
  setIsLoading,
  setFormData,
}: StepProps) => {
  // Make a third step that shows that the task has been created and a possible link to the task if the task is public. This view should only be visible when creating a task, not when editing a task.
  return step === 2 ? (
    <Step2
      step={step}
      isLoading={isLoading}
      formData={formData}
      setStep={setStep}
      setIsLoading={setIsLoading}
      setFormData={setFormData}
    />
  ) : (
    <Step1
      step={step}
      isLoading={isLoading}
      formData={formData}
      setStep={setStep}
      setIsLoading={setIsLoading}
      setFormData={setFormData}
    />
  );
};

export default Steps;
