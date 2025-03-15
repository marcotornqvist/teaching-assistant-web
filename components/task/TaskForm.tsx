'use client';

import { Button } from 'components/ui/Button';
import { CirclePlus } from 'lucide-react';
import React, { useState, FormEvent } from 'react';
import { z } from 'zod';
import { SortableContainer } from 'components/sortable-list/SortableContainer';
import { toast } from 'sonner';
import QuestionItem from 'components/task/QuestionItem';
import { generateId } from 'lib/helpers/generateId';
import Toolbar from './Toolbar';

export const INPUT_MAX_LENGTH = 1000;

const CreateTaskFormSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().max(INPUT_MAX_LENGTH, {
          message: `Text must be less than ${INPUT_MAX_LENGTH} characters.`,
        }),
        hint: z
          .string()
          .max(INPUT_MAX_LENGTH, {
            message: `Hint must be less than ${INPUT_MAX_LENGTH} characters.`,
          })
          .nullable(),
        answers: z
          .array(
            z.object({
              id: z.string(),
              text: z
                .string()
                .min(1, {
                  message: 'Answer must be at least 1 character long.',
                })
                .max(INPUT_MAX_LENGTH, {
                  message: `Answer must be less than ${INPUT_MAX_LENGTH} characters.`,
                }),
              isCorrect: z.boolean(),
              errors: z.array(z.string()),
            }),
          )
          .min(1, {
            message: 'At least one answer is required.',
          }),
        textAnswer: z.boolean().default(false),
        errors: z.array(z.string()),
      }),
    )
    .min(1, { message: 'At least one question is required.' }),
});

export type TaskFormData = z.infer<typeof CreateTaskFormSchema>;

type TaskFormProps = {
  formData: TaskFormData;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
};

const Page: React.FC<TaskFormProps> = ({
  formData,
  setFormData,
}: TaskFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

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

  const resetAllErrors = (): void => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => ({
        ...item,
        errors: [],
      })),
    }));
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = CreateTaskFormSchema.parse(formData);
      resetAllErrors();
      console.log('submitted', validatedData);
      toast.success('Task submitted successfully!');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const globalErrors = error.errors.filter(
          (err) => err.path.length === 1,
        );

        if (globalErrors.length > 0) {
          toast.error(globalErrors.map((err) => err.message).join(' '));
        }

        setFormData((prev) => ({
          ...prev,
          items: prev.items.map((item, i) => {
            const itemErrors = error.errors.filter(
              (err) => err.path[1] === i && err.path.length === 3,
            );

            const answerErrors = error.errors.filter(
              (err) => err.path[1] === i && err.path.length === 5,
            );

            return {
              ...item,
              errors: itemErrors.map((err) => err.message),
              answers: item.answers.map((answer, j) => ({
                ...answer,
                errors: answerErrors
                  .filter((err) => err.path[3] === j)
                  .map((err) => err.message),
              })),
            };
          }),
        }));
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Toolbar />
      <SortableContainer
        lists={formData.items}
        onChange={handleListsChange}
        className='flex flex-col gap-8 lg:gap-12'
        renderList={(item) => (
          <QuestionItem
            item={item}
            handleQuestionChange={handleQuestionChange}
            handleItemsChange={handleItemsChange}
            handleAnswerTextChange={handleAnswerTextChange}
            handleCorrectAnswerToggle={handleCorrectAnswerToggle}
            handleRemoveAnswer={handleRemoveAnswer}
            handleAddAnswer={handleAddAnswer}
            handleToggleHint={handleToggleHint}
            handleHintTextChange={handleHintTextChange}
            handleToggleTextAnswer={handleToggleTextAnswer}
            handleRemoveQuestion={handleRemoveQuestion}
          />
        )}
      />

      <div className='mt-8 flex justify-center lg:mt-12'>
        <Button type='button' onClick={handleAddQuestion} className=''>
          Add Question <CirclePlus className='ml-2' strokeWidth={1.5} />
        </Button>
      </div>
    </form>
  );
};

export default Page;
