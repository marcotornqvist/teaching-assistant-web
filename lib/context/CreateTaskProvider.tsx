'use client';

import { Step1FormData } from 'components/task/Step1';
import { generateId } from 'lib/helpers/generateId';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

type CreateTaskContextType = {
  isLoading: boolean;
  formData: Step1FormData;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setFormData: Dispatch<SetStateAction<Step1FormData>>;
};

const CreateTaskContext = createContext<CreateTaskContextType>({
  isLoading: false,
  formData: {
    items: [],
  },
  setIsLoading: () => {},
  setFormData: () => {},
} satisfies CreateTaskContextType);

// Default form data
const defaultFormData: Step1FormData = {
  items: [
    {
      id: generateId(),
      text: 'What colors are in the Swedish flag? (Select all that apply)',
      hint: null,
      textAnswer: false,
      errors: [],
      answers: [
        {
          id: generateId(),
          text: 'Blue',
          isCorrect: false,
          errors: [],
        },
        {
          id: generateId(),
          text: 'Yellow',
          isCorrect: false,
          errors: [],
        },
        {
          id: generateId(),
          text: 'Red',
          isCorrect: false,
          errors: [],
        },
        {
          id: generateId(),
          text: 'Green',
          isCorrect: false,
          errors: [],
        },
      ],
    },
    {
      id: generateId(),
      text: 'What is the capital of Sweden?',
      hint: null,
      textAnswer: false,
      errors: [],
      answers: [
        {
          id: generateId(),
          text: 'Oslo',
          isCorrect: false,
          errors: [],
        },
        {
          id: generateId(),
          text: 'Helsinki',
          isCorrect: false,
          errors: [],
        },
        {
          id: generateId(),
          text: 'Stockholm',
          isCorrect: true,
          errors: [],
        },
        {
          id: generateId(),
          text: 'Copenhagen',
          isCorrect: false,
          errors: [],
        },
      ],
    },
  ],
};

export const CreateTaskProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Step1FormData>({
    items: [],
  });

  useEffect(() => {
    const storedData = localStorage.getItem('Step1FormData');
    const parsedData = storedData ? JSON.parse(storedData) : undefined;
    if (parsedData?.items.length > 0) {
      setFormData(parsedData);
    } else {
      setFormData(defaultFormData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('Step1FormData', JSON.stringify(formData));
  }, [formData]);

  return (
    <CreateTaskContext.Provider
      value={{
        isLoading,
        formData,
        setIsLoading,
        setFormData,
      }}
    >
      {children}
    </CreateTaskContext.Provider>
  );
};

export const useCreateTaskContext = () => {
  const context = useContext(CreateTaskContext);
  if (!context) {
    throw new Error(
      'useCreateTaskProvider must be used within a CreateTaskProvider',
    );
  }
  return context;
};
