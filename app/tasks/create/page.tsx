'use client';

import { Button } from 'components/ui/Button';
import TextareaDynamicHeight from 'components/elements/TextareaDynamicHeight';
import { Checkbox } from 'components/ui/Checkbox';
import { cn } from 'lib/utils';
import {
  CirclePlus,
  CircleX,
  GripVertical,
  NotepadText,
  WandSparkles,
} from 'lucide-react';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';

const INPUT_MAX_LENGTH = 1000;

const CreateTaskFormSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        text: z
          .string()
          .min(3, {
            message: 'Text must be at least 3 characters.',
          })
          .max(INPUT_MAX_LENGTH, {
            message: `Text must be less than ${INPUT_MAX_LENGTH} characters.`,
          }),
        answers: z.array(
          z.object({
            id: z.string(),
            text: z.string(),
            hint: z.string().optional(),
            isCorrect: z.boolean(),
          }),
        ),
      }),
    )
    .min(1, { message: 'At least one question is required' }),
});

type TaskFormData = z.infer<typeof CreateTaskFormSchema>;

type FormErrors = {
  [key: string]: string;
};

const generateId = (): string => Math.random().toString(36).substring(2, 15);

const Page: React.FC = () => {
  const [formData, setFormData] = useState<TaskFormData>({
    items: [
      {
        id: generateId(),
        text: 'What colors are in the Swedish flag? (Select all that apply)',
        answers: [
          {
            id: generateId(),
            text: 'Blue',
            hint: 'This is one of the correct colors.',
            isCorrect: false,
          },
          {
            id: generateId(),
            text: 'Yellow',
            hint: 'This is one of the correct colors.',
            isCorrect: false,
          },
          {
            id: generateId(),
            text: 'Red',
            hint: 'This is not in the Swedish flag.',
            isCorrect: false,
          },
          {
            id: generateId(),
            text: 'Green',
            hint: 'This is not in the Swedish flag.',
            isCorrect: false,
          },
        ],
      },
      {
        id: generateId(),
        text: 'What is the capital of Sweden?',
        answers: [
          {
            id: generateId(),
            text: 'Oslo',
            hint: 'This is the capital of Norway.',
            isCorrect: false,
          },
          {
            id: generateId(),
            text: 'Helsinki',
            hint: 'This is the capital of Finland.',
            isCorrect: false,
          },
          {
            id: generateId(),
            text: 'Stockholm',
            hint: 'This is the correct answer.',
            isCorrect: true,
          },
          {
            id: generateId(),
            text: 'Copenhagen',
            hint: 'This is the capital of Denmark.',
            isCorrect: false,
          },
        ],
      },
    ],
  });

  const [errors, setErrors] = useState<FormErrors>({});

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

  const handleAddQuestion = (): void => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: generateId(),
          text: '',
          answers: [
            {
              id: generateId(),
              text: '',
              hint: '',
              isCorrect: false,
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
                { id: generateId(), text: '', hint: '', isCorrect: false },
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

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    try {
      const validatedData = CreateTaskFormSchema.parse(formData);
      console.log('submitted', validatedData);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: FormErrors = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          formattedErrors[path] = err.message;
        });
        setErrors(formattedErrors);
      }
      console.error('Validation error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {formData.items.map((item, itemIndex) => (
        <div
          key={item.id}
          className='mb-8 flex w-full flex-1 flex-col rounded-md bg-black p-5'
        >
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='font-medium text-white'>Question {itemIndex + 1}</h3>
            {formData.items.length > 1 && (
              <button
                className='group -m-2 rounded-full p-2 outline-none'
                type='button'
                onClick={() => handleRemoveQuestion(item.id)}
              >
                <CircleX
                  strokeWidth={1.5}
                  className='text-red group-hover:fill-red group-hover:text-white group-focus-visible:fill-red group-focus-visible:text-white'
                />
              </button>
            )}
          </div>

          <div className='mb-4'>
            <TextareaDynamicHeight
              value={item.text}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                handleQuestionChange(item.id, e.target.value)
              }
              placeholder='Write your question here...'
              maxLength={INPUT_MAX_LENGTH}
            />
            {errors[`items.${itemIndex}.text`] && (
              <p className='text-red-500 text-sm mt-1'>
                {errors[`items.${itemIndex}.text`]}
              </p>
            )}
          </div>

          {item.answers.length > 0 && (
            <div className='mb-4 flex flex-col space-y-4'>
              {item.answers.map((answer, answerIndex) => (
                <div
                  key={answer.id}
                  className='flex w-full items-center gap-4 space-y-0'
                >
                  <GripVertical
                    strokeWidth={1.5}
                    width={24}
                    height={24}
                    className='text-white'
                  />
                  <div
                    className={cn(
                      'flex min-h-12 w-full items-center justify-between gap-4 space-y-0 rounded-md border px-5 py-2.5',
                      answer.isCorrect ? 'border-green' : 'border-red',
                    )}
                  >
                    <TextareaDynamicHeight
                      value={answer.text}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        handleAnswerTextChange(
                          item.id,
                          answer.id,
                          e.target.value,
                        )
                      }
                      className='!text-sm w-full resize-none overflow-hidden bg-black !font-normal leading-[150%] text-white outline-none lg:text-base placeholder:text-grey'
                      placeholder='Write an answer option...'
                      maxLength={INPUT_MAX_LENGTH}
                    />
                    <Checkbox
                      checked={answer.isCorrect}
                      onCheckedChange={() =>
                        handleCorrectAnswerToggle(item.id, answer.id)
                      }
                    />
                  </div>
                  <button
                    className='group -m-2 rounded-full p-2 outline-none'
                    type='button'
                    onClick={() => handleRemoveAnswer(item.id, answer.id)}
                  >
                    <CircleX
                      strokeWidth={1.5}
                      className='text-red group-hover:fill-red group-hover:text-white group-focus-visible:fill-red group-focus-visible:text-white'
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className='mt-2 flex flex-row flex-wrap items-center gap-x-4 gap-y-3'>
            <Button
              type='button'
              size='iconRight'
              onClick={() => handleAddAnswer(item.id)}
            >
              Add Answer
              <CirclePlus strokeWidth={1.5} width={20} />
            </Button>
            <Button size='iconRight'>
              Add Hint
              <CirclePlus strokeWidth={1.5} height={20} />
            </Button>
            <Button size='iconRight'>
              Generate Answers
              <WandSparkles strokeWidth={1.5} width={20} height={20} />
            </Button>
            <Button type='button'>
              Mark as Text Answer{' '}
              <NotepadText strokeWidth={1.5} width={20} height={20} />
            </Button>
          </div>
        </div>
      ))}

      <div className='mt-4 flex justify-center'>
        <Button
          type='button'
          onClick={handleAddQuestion}
          className='w-full md:w-auto'
        >
          Add Question <CirclePlus className='ml-2' strokeWidth={1.5} />
        </Button>
      </div>

      <div className='mt-8 flex justify-end'>
        <Button type='submit'>Save Task</Button>
      </div>
    </form>
  );
};

export default Page;
