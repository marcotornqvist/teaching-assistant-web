'use client';

import { Button } from 'components/ui/Button';
import TextareaDynamicHeight from 'components/elements/TextareaDynamicHeight';
import { Checkbox } from 'components/ui/Checkbox';
import { cn } from 'lib/utils';
import {
  CirclePlus,
  CircleX,
  Lightbulb,
  NotepadText,
  WandSparkles,
} from 'lucide-react';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';
import {
  SortableContainer,
  SortableContainerItem,
  ContainerDragHandle,
} from 'components/sortable-list/SortableContainer';
import { SortableList } from 'components/sortable-list/SortableList';
import { toast } from 'sonner';

const INPUT_MAX_LENGTH = 1000;

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

type TaskFormData = z.infer<typeof CreateTaskFormSchema>;

const generateId = (): string => Math.random().toString(36).substring(2, 15);

const Page: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
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

      <div className='mt-8 flex justify-center lg:mt-12'>
        <Button type='submit' disabled={isLoading}>
          Submit Task
        </Button>
      </div>
    </form>
  );
};

type QuestionItemProps = {
  item: TaskFormData['items'][0];
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

const QuestionItem: React.FC<QuestionItemProps> = ({
  item,
  handleQuestionChange,
  handleItemsChange,
  handleAnswerTextChange,
  handleCorrectAnswerToggle,
  handleRemoveAnswer,
  handleAddAnswer,
  handleToggleHint,
  handleHintTextChange,
  handleToggleTextAnswer,
  handleRemoveQuestion,
}) => {
  return (
    <SortableContainerItem
      id={item.id}
      className={cn(
        'flex w-full flex-1 flex-col rounded-md border bg-black p-3 lg:relative lg:p-5',
        item.errors.length > 0 ||
          item.answers.some((answer) => answer.errors.length > 0)
          ? 'border-red'
          : 'border-black',
      )}
    >
      <div className='flex items-center justify-between max-lg:relative max-lg:mb-5'>
        <ContainerDragHandle className='lg:absolute lg:-left-12 lg:top-1/2 lg:-translate-y-1/2 lg:p-2' />
        <button
          className='group rounded-full outline-none lg:absolute lg:-right-12 lg:top-1/2 lg:-translate-y-1/2 lg:p-2'
          type='button'
          onClick={() => handleRemoveQuestion(item.id)}
        >
          <CircleX
            strokeWidth={1.5}
            className='text-red group-hover:fill-red group-hover:text-white group-focus-visible:fill-red group-focus-visible:text-white'
          />
        </button>
      </div>
      <div className='flex flex-col gap-4'>
        <TextareaDynamicHeight
          value={item.text}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            handleQuestionChange(item.id, e.target.value)
          }
          placeholder='Write your question here...'
          maxLength={INPUT_MAX_LENGTH}
        />
        {item.answers.length > 0 ? (
          <SortableList
            items={item.answers}
            onChange={(items) => {
              handleItemsChange(item.id, items);
            }}
            className='flex flex-col gap-4'
            renderItem={(answer) => (
              <SortableList.Item
                id={answer.id}
                className='flex w-full flex-col gap-4 space-y-0'
              >
                <div className='flex w-full flex-row gap-4'>
                  <SortableList.DragHandle />
                  <div
                    className={cn(
                      'flex min-h-12 w-full items-center justify-between gap-4 space-y-0 rounded-md border px-3 py-2.5 lg:px-5',
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
                {answer.errors.length > 0 ? (
                  <span className='text-sm px-10 text-red'>
                    {answer.errors.join(' ')}
                  </span>
                ) : null}
              </SortableList.Item>
            )}
          />
        ) : null}
        {typeof item.hint === 'string' ? (
          <div
            className={cn(
              'flex min-h-12 w-full items-center justify-between gap-4 space-y-0 rounded-md border border-grey px-3 py-2.5 lg:px-5',
            )}
          >
            <TextareaDynamicHeight
              value={item.hint}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                handleHintTextChange(item.id, e.target.value)
              }
              className='!text-sm w-full resize-none overflow-hidden bg-black !font-normal leading-[150%] text-white outline-none lg:text-base placeholder:text-grey'
              placeholder='Write a hint...'
              maxLength={INPUT_MAX_LENGTH}
            />
            <Lightbulb width={24} height={24} className='text-grey' />
          </div>
        ) : null}
        <div className='flex flex-row flex-wrap items-center gap-x-4 gap-y-3'>
          <Button
            type='button'
            size='iconRight'
            onClick={() => handleAddAnswer(item.id)}
          >
            Add Answer
            <CirclePlus strokeWidth={1.5} width={20} />
          </Button>
          <Button
            size='iconRight'
            type='button'
            onClick={() => handleToggleHint(item.id)}
            className={
              typeof item.hint === 'string' ? 'border-green text-green' : ''
            }
          >
            {typeof item.hint === 'string' ? 'Remove Hint' : 'Add Hint'}
            {typeof item.hint === 'string' ? (
              <CircleX strokeWidth={1.5} height={20} />
            ) : (
              <CirclePlus strokeWidth={1.5} height={20} />
            )}
          </Button>
          <Button size='iconRight'>
            Generate Answers
            <WandSparkles strokeWidth={1.5} width={20} height={20} />
          </Button>
          <Button
            type='button'
            onClick={() => handleToggleTextAnswer(item.id)}
            className={item.textAnswer ? 'border-green text-green' : ''}
          >
            Mark as Text Answer
            <NotepadText strokeWidth={1.5} width={20} height={20} />
          </Button>
        </div>
        {item.errors.length > 0 ? (
          <span className='text-sm text-red'>{item.errors.join(' ')}</span>
        ) : null}
      </div>
    </SortableContainerItem>
  );
};

export default Page;
