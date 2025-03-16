'use client';

import Step1, { Step1FormData } from 'components/task/Step1';
import React, { useState } from 'react';
import { useCreateTaskContext } from 'lib/context/CreateTaskProvider';
import Step2 from 'components/task/Step2';
import Steps, { Step } from 'components/task/Steps';

const Page = () => {
  const { isLoading, setIsLoading, formData, setFormData } =
    useCreateTaskContext();
  const [step, setStep] = useState<Step>(1);

  // const [formData, setFormData] = React.useState<Step1FormData>({
  //   items: [],
  // });
  // const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Steps
      step={step}
      isLoading={isLoading}
      formData={formData}
      setStep={setStep}
      setIsLoading={setIsLoading}
      setFormData={setFormData}
    />
  );
};

export default Page;
