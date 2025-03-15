'use client';

import { TaskFormData } from 'components/task/TaskForm';
import { generateId } from 'lib/helpers/generateId';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

export type QuestionItemHandlerType = {
  handleQuestionChange: (itemId: string, value: string) => void;
  handleItemsChange: (
    questionId: string,
    newAnswers: TaskFormData['items'][0]['answers'],
  ) => void;
  handleAnswerTextChange: (
    itemId: string,
    answerId: string,
    value: string,
  ) => void;
  handleCorrectAnswerToggle: (itemId: string, answerId: string) => void;
  handleRemoveAnswer: (itemId: string, answerId: string) => void;
  handleAddAnswer: (itemId: string) => void;
  handleToggleHint: (itemId: string) => void;
  handleHintTextChange: (itemId: string, value: string) => void;
  handleToggleTextAnswer: (itemId: string) => void;
  handleRemoveQuestion: (itemId: string) => void;
};

type CreateTaskContextType = {
  formData: TaskFormData;
  setFormData: Dispatch<SetStateAction<TaskFormData>>;
  handleListsChange: (newItems: TaskFormData['items']) => void;
  handleAddQuestion: () => void;
  handleResetAllErrors: () => void;
  handleRemoveAllQuestions: () => void;
} & QuestionItemHandlerType;

const CreateTaskContext = createContext<CreateTaskContextType>({
  formData: {
    items: [],
  },
  setFormData: () => {},
  handleListsChange: () => {},
  handleItemsChange: () => {},
  handleQuestionChange: () => {},
  handleAnswerTextChange: () => {},
  handleCorrectAnswerToggle: () => {},
  handleToggleHint: () => {},
  handleHintTextChange: () => {},
  handleToggleTextAnswer: () => {},
  handleAddQuestion: () => {},
  handleRemoveQuestion: () => {},
  handleAddAnswer: () => {},
  handleRemoveAnswer: () => {},
  handleResetAllErrors: () => {},
  handleRemoveAllQuestions: () => {},
} satisfies CreateTaskContextType);

export const CreateTaskProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
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
  });

  const handleListsChange = (newItems: TaskFormData['items']): void => {
    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const handleItemsChange = (
    questionId: string,
    newAnswers: TaskFormData['items'][0]['answers'],
  ): void => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === questionId ? { ...item, answers: newAnswers } : item,
      ),
    }));
  };

  const handleQuestionChange = (itemId: string, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, text: value } : item,
      ),
    }));
  };

  const handleAnswerTextChange = (
    itemId: string,
    answerId: string,
    value: string,
  ): void => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              answers: item.answers.map((answer) =>
                answer.id === answerId ? { ...answer, text: value } : answer,
              ),
            }
          : item,
      ),
    }));
  };

  const handleCorrectAnswerToggle = (
    itemId: string,
    answerId: string,
  ): void => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              answers: item.answers.map((answer) =>
                answer.id === answerId
                  ? { ...answer, isCorrect: !answer.isCorrect }
                  : answer,
              ),
            }
          : item,
      ),
    }));
  };

  const handleToggleHint = (itemId: string): void => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              hint: typeof item.hint === 'string' ? null : '',
            }
          : item,
      ),
    }));
  };

  const handleHintTextChange = (itemId: string, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, hint: value } : item,
      ),
    }));
  };

  const handleToggleTextAnswer = (itemId: string): void => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              textAnswer: !item.textAnswer,
            }
          : item,
      ),
    }));
  };

  const handleAddQuestion = (): void => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: generateId(),
          text: '',
          hint: null,
          textAnswer: false,
          errors: [],
          answers: [
            {
              id: generateId(),
              text: '',
              isCorrect: false,
              errors: [],
            },
          ],
        },
      ],
    }));
  };

  const handleRemoveQuestion = (itemId: string): void => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const handleAddAnswer = (itemId: string): void => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              answers: [
                ...item.answers,
                { id: generateId(), text: '', isCorrect: false, errors: [] },
              ],
            }
          : item,
      ),
    }));
  };

  const handleRemoveAnswer = (itemId: string, answerId: string): void => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              answers: item.answers.filter((answer) => answer.id !== answerId),
            }
          : item,
      ),
    }));
  };

  const handleResetAllErrors = (): void => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => ({
        ...item,
        errors: [],
      })),
    }));
  };

  const handleRemoveAllQuestions = (): void => {
    setFormData((prev) => ({
      ...prev,
      items: [],
    }));
  };

  return (
    <CreateTaskContext.Provider
      value={{
        formData,
        setFormData,
        handleQuestionChange,
        handleAnswerTextChange,
        handleCorrectAnswerToggle,
        handleToggleHint,
        handleHintTextChange,
        handleToggleTextAnswer,
        handleAddQuestion,
        handleRemoveQuestion,
        handleAddAnswer,
        handleResetAllErrors,
        handleListsChange,
        handleItemsChange,
        handleRemoveAnswer,
        handleRemoveAllQuestions,
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
