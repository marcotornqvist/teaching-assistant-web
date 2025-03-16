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
import React, { ChangeEvent, useEffect, useRef } from 'react';
import {
  SortableContainerItem,
  ContainerDragHandle,
} from 'components/sortable-list/SortableContainer';
import { SortableList } from 'components/sortable-list/SortableList';
import { INPUT_MAX_LENGTH, Step1FormData } from './Step1';

type QuestionItemHandlerType = {
  handleQuestionChange: (itemId: string, value: string) => void;
  handleItemsChange: (
    questionId: string,
    newAnswers: Step1FormData['items'][0]['answers'],
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

type QuestionItemProps = {
  item: Step1FormData['items'][0];
} & QuestionItemHandlerType;

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
  const ref = useRef<HTMLDivElement>(null);
  const errorsExist =
    item.errors.length > 0 ||
    item.answers.some((answer) => answer.errors.length > 0);

  useEffect(() => {
    if (ref.current && errorsExist) {
      console.log('scrolling to ref');
      ref.current.scrollIntoView({
        block: 'center',
      });
    }
  }, [ref.current, errorsExist]);

  return (
    <SortableContainerItem
      id={item.id}
      className={cn(
        'flex w-full flex-col rounded-md border bg-black p-3 lg:relative lg:p-5',
        errorsExist ? 'border-red' : 'border-black',
      )}
    >
      <div
        className='flex items-center justify-between max-lg:relative max-lg:mb-5'
        ref={ref}
      >
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

export default QuestionItem;
