'use client';

import { Button } from 'components/ui/Button';
import { CirclePlus } from 'lucide-react';
import React, { FormEvent } from 'react';
import { z } from 'zod';
import { SortableContainer } from 'components/sortable-list/SortableContainer';
import { toast } from 'sonner';
import QuestionItem from 'components/task/QuestionItem';
import Toolbar, { Step1Toolbar } from './Step1Toolbar';
import { useRouter } from 'next/navigation';

import { experimental_useObject as useObject } from '@ai-sdk/react';

import ChatBox from 'components/misc/chat-box/ChatBox';
import { ChatMaterialResponseSchema } from 'lib/schema';
import { generateId } from 'lib/helpers/generateId';
import { StepProps } from './Steps';

export const INPUT_MAX_LENGTH = 1000;
const MAX_QUESTIONS = 50;
const MAX_ANSWERS = 10;

export const Step1Schema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        text: z
          .string()
          .min(1, {
            message: 'Question must be at least 1 character long.',
          })
          .max(INPUT_MAX_LENGTH, {
            message: `Question must be less than ${INPUT_MAX_LENGTH} characters.`,
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
          })
          .max(MAX_ANSWERS, {
            message: 'A maximum of 10 answers is allowed per question.',
          }),
        textAnswer: z.boolean().default(false),
        errors: z.array(z.string()),
      }),
    )
    .min(1, { message: 'At least one question is required.' })
    .max(MAX_QUESTIONS, {
      message: 'A maximum of 50 questions is allowed.',
    }),
});

export type Step1FormData = z.infer<typeof Step1Schema>;

const Step1 = (props: StepProps) => {
  const { setStep, setIsLoading, formData, setFormData } = props;
  const {
    isLoading: isChatboxLoading,
    object,
    submit,
    stop,
  } = useObject({
    api: '/api/materials/chat',
    schema: ChatMaterialResponseSchema,
  });

  const handleListsChange = (newItems: Step1FormData['items']): void => {
    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const handleItemsChange = (
    questionId: string,
    newAnswers: Step1FormData['items'][0]['answers'],
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
        answers: item.answers.map((answer) => ({
          ...answer,
          errors: [],
        })),
      })),
    }));
  };

  const handleNextPage = (): void => {
    setIsLoading(true);

    try {
      const validatedData = Step1Schema.parse(formData);

      if (!validatedData) {
        throw new Error('Validation failed');
      }

      handleResetAllErrors();
      setStep(2);
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
    <>
      <div className='mb-8 flex flex-1 flex-col lg:mb-12'>
        <Step1Toolbar handleNextPage={handleNextPage} {...props} />
        <div className='flex flex-1 flex-col justify-center'>
          <div className='flex flex-1'>
            <SortableContainer
              lists={formData.items}
              onChange={handleListsChange}
              className='flex flex-1 flex-col gap-8'
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
          </div>
          <div className='mt-8 flex justify-center lg:mt-12'>
            <Button
              type='button'
              onClick={handleAddQuestion}
              disabled={formData.items.length >= MAX_QUESTIONS ? true : false}
            >
              Add Question Block <CirclePlus strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </div>
      <ChatBox
        submit={submit}
        isLoading={isChatboxLoading}
        stop={stop}
        className='mt-0'
      />
    </>
  );
};

export default Step1;
