'use client';

import { Button } from 'components/ui/Button';
import { CirclePlus } from 'lucide-react';
import React, { useState, FormEvent } from 'react';
import { z } from 'zod';
import { SortableContainer } from 'components/sortable-list/SortableContainer';
import { toast } from 'sonner';
import QuestionItem from 'components/task/QuestionItem';
import { useCreateTaskContext } from 'lib/context/CreateTaskProvider';
import Toolbar from './Toolbar';

export const INPUT_MAX_LENGTH = 1000;

const CreateTaskFormSchema = z.object({
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
          }),
        textAnswer: z.boolean().default(false),
        errors: z.array(z.string()),
      }),
    )
    .min(1, { message: 'At least one question is required.' }),
});

export type TaskFormData = z.infer<typeof CreateTaskFormSchema>;

const Page = () => {
  const {
    setIsLoading,
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
  } = useCreateTaskContext();

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = CreateTaskFormSchema.parse(formData);
      handleResetAllErrors();
      setTimeout(() => {}, 1000);
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
    <form
      onSubmit={handleSubmit}
      className='mb-8 flex flex-1 flex-col lg:mb-12'
    >
      <Toolbar />
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
          <Button type='button' onClick={handleAddQuestion} className=''>
            Add Question Block <CirclePlus className='ml-2' strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Page;
