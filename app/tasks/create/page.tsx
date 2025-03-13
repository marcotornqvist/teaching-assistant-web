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
        answers: z.array(
          z.object({
            id: z.string(),
            text: z.string(),
            isCorrect: z.boolean(),
          }),
        ),
        textAnswer: z.boolean().default(false),
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
        hint: null,
        textAnswer: false,
        answers: [
          {
            id: generateId(),
            text: 'Blue',
            isCorrect: false,
          },
          {
            id: generateId(),
            text: 'Yellow',
            isCorrect: false,
          },
          {
            id: generateId(),
            text: 'Red',
            isCorrect: false,
          },
          {
            id: generateId(),
            text: 'Green',
            isCorrect: false,
          },
        ],
      },
      {
        id: generateId(),
        text: 'What is the capital of Sweden?',
        hint: null,
        textAnswer: false,
        answers: [
          {
            id: generateId(),
            text: 'Oslo',
            isCorrect: false,
          },
          {
            id: generateId(),
            text: 'Helsinki',
            isCorrect: false,
          },
          {
            id: generateId(),
            text: 'Stockholm',
            isCorrect: true,
          },
          {
            id: generateId(),
            text: 'Copenhagen',
            isCorrect: false,
          },
        ],
      },
    ],
  });
  const [errors, setErrors] = useState<FormErrors>({});

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
          answers: [
            {
              id: generateId(),
              text: '',
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
                { id: generateId(), text: '', isCorrect: false },
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
      <SortableContainer
        lists={formData.items}
        onChange={handleListsChange}
        className='flex flex-col gap-8 lg:gap-12'
        renderList={(list) => (
          <QuestionItem
            list={list}
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
        <Button type='submit'>Submit Task</Button>
      </div>
    </form>
  );
};

type QuestionItemProps = {
  list: TaskFormData['items'][0];
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
  list,
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
      id={list.id}
      className='flex w-full flex-1 flex-col rounded-md bg-black p-3 lg:relative lg:p-5'
    >
      <div className='flex items-center justify-between max-lg:relative max-lg:mb-5'>
        <ContainerDragHandle className='lg:absolute lg:-left-12 lg:top-1/2 lg:-translate-y-1/2 lg:p-2' />
        <button
          className='group rounded-full outline-none lg:absolute lg:-right-12 lg:top-1/2 lg:-translate-y-1/2 lg:p-2'
          type='button'
          onClick={() => handleRemoveQuestion(list.id)}
        >
          <CircleX
            strokeWidth={1.5}
            className='text-red group-hover:fill-red group-hover:text-white group-focus-visible:fill-red group-focus-visible:text-white'
          />
        </button>
      </div>
      <div className='flex flex-col gap-4'>
        <TextareaDynamicHeight
          value={list.text}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            handleQuestionChange(list.id, e.target.value)
          }
          placeholder='Write your question here...'
          maxLength={INPUT_MAX_LENGTH}
        />
        {list.answers.length > 0 ? (
          <SortableList
            items={list.answers}
            onChange={(items) => {
              handleItemsChange(list.id, items);
            }}
            className='flex flex-col gap-4'
            renderItem={(answer) => (
              <SortableList.Item
                id={answer.id}
                className='flex w-full items-center gap-4 space-y-0'
              >
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
                      handleAnswerTextChange(list.id, answer.id, e.target.value)
                    }
                    className='!text-sm w-full resize-none overflow-hidden bg-black !font-normal leading-[150%] text-white outline-none lg:text-base placeholder:text-grey'
                    placeholder='Write an answer option...'
                    maxLength={INPUT_MAX_LENGTH}
                  />
                  <Checkbox
                    checked={answer.isCorrect}
                    onCheckedChange={() =>
                      handleCorrectAnswerToggle(list.id, answer.id)
                    }
                  />
                </div>
                <button
                  className='group -m-2 rounded-full p-2 outline-none'
                  type='button'
                  onClick={() => handleRemoveAnswer(list.id, answer.id)}
                >
                  <CircleX
                    strokeWidth={1.5}
                    className='text-red group-hover:fill-red group-hover:text-white group-focus-visible:fill-red group-focus-visible:text-white'
                  />
                </button>
              </SortableList.Item>
            )}
          />
        ) : null}
        {typeof list.hint === 'string' ? (
          <div
            className={cn(
              'flex min-h-12 w-full items-center justify-between gap-4 space-y-0 rounded-md border border-grey px-3 py-2.5 lg:px-5',
            )}
          >
            <TextareaDynamicHeight
              value={list.hint}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                handleHintTextChange(list.id, e.target.value)
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
            onClick={() => handleAddAnswer(list.id)}
          >
            Add Answer
            <CirclePlus strokeWidth={1.5} width={20} />
          </Button>
          <Button
            size='iconRight'
            type='button'
            onClick={() => handleToggleHint(list.id)}
            className={
              typeof list.hint === 'string' ? 'border-green text-green' : ''
            }
          >
            {typeof list.hint === 'string' ? 'Remove Hint' : 'Add Hint'}
            {typeof list.hint === 'string' ? (
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
            onClick={() => handleToggleTextAnswer(list.id)}
            className={list.textAnswer ? 'border-green text-green' : ''}
          >
            Mark as Text Answer
            <NotepadText strokeWidth={1.5} width={20} height={20} />
          </Button>
        </div>
      </div>
    </SortableContainerItem>
  );
};

export default Page;
