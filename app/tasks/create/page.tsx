'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'components/ui/Button';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from 'components/ui/Form';
import { RadioGroup, RadioGroupItem } from 'components/ui/RadioGroup';
import {
  CirclePlus,
  CircleX,
  GripVertical,
  NotepadText,
  WandSparkles,
} from 'lucide-react';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { z } from 'zod';
import TextareaDynamicHeight from 'components/elements/TextareaDynamicHeight';
import { Checkbox } from 'components/ui/Checkbox';
import { cn } from 'lib/utils';

// Teachers can create tasks here.

const INPUT_MAX_LENGTH = 1000;

export const CreateTaskFormSchema = z.object({
  text: z
    .string()
    .min(3, {
      message: 'Text must be at least 3 characters.',
    })
    .max(INPUT_MAX_LENGTH, {
      message: `Text must be less than ${INPUT_MAX_LENGTH} characters.`,
    }),
  answers: z
    .array(
      z.object({
        text: z.string(),
        hint: z.string().optional(),
        isCorrect: z.boolean(),
      }),
    )
    .refine((answers) => answers.some((answer) => answer.isCorrect), {
      message: 'At least one answer must be marked as correct.',
    }),
});

type CreateTaskFormValues = z.infer<typeof CreateTaskFormSchema>;

const Page = () => {
  // No need for correctAnswerIndex since multiple answers can be correct
  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(CreateTaskFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldUnregister: false,
    defaultValues: {
      text: 'What colors are in the Swedish flag? (Select all that apply)',
      answers: [
        {
          text: 'Blue',
          hint: 'This is one of the correct colors.',
          isCorrect: false,
        },
        {
          text: 'Yellow',
          hint: 'This is one of the correct colors.',
          isCorrect: false,
        },
        {
          text: 'Red',
          hint: 'This is not in the Swedish flag.',
          isCorrect: false,
        },
        {
          text: 'Green',
          hint: 'This is not in the Swedish flag.',
          isCorrect: false,
        },
      ],
    },
  });

  // Use fieldArray to manage the answers array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'answers',
  });

  const onSubmit = (data: CreateTaskFormValues) => {
    console.log('submitted', data);
  };

  const handleCorrectAnswerToggle = (index: number) => {
    // Toggle the isCorrect value of the clicked answer
    const currentValue = form.getValues(`answers.${index}.isCorrect`);
    form.setValue(`answers.${index}.isCorrect`, !currentValue);
  };

  const addNewAnswer = () => {
    append({ text: '', hint: '', isCorrect: false });
  };

  return (
    <div className='rounded-md bg-black p-5'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex w-full flex-1 flex-col'
        >
          <FormField
            control={form.control}
            name='text'
            render={({ field }) => (
              <FormItem className='space-y-0'>
                <FormControl>
                  <TextareaDynamicHeight
                    {...field}
                    className='mb-4'
                    placeholder='Write your question here...'
                    maxLength={INPUT_MAX_LENGTH}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {fields.length > 0 ? (
            <div className='mb-4 flex flex-col space-y-4'>
              {fields.map((field, index) => (
                <FormItem
                  key={field.id}
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
                      form.watch(`answers.${index}.isCorrect`)
                        ? 'border-green'
                        : 'border-red',
                    )}
                  >
                    <FormField
                      control={form.control}
                      name={`answers.${index}.text`}
                      render={({ field: textField }) => (
                        <TextareaDynamicHeight
                          {...textField}
                          className='!text-sm w-full resize-none overflow-hidden bg-black !font-normal leading-[150%] text-white outline-none lg:text-base placeholder:text-grey'
                          placeholder='Write an answer option...'
                          maxLength={INPUT_MAX_LENGTH}
                        />
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`answers.${index}.isCorrect`}
                      render={({ field: checkField }) => (
                        <FormControl>
                          <Checkbox
                            checked={checkField.value}
                            onCheckedChange={() =>
                              handleCorrectAnswerToggle(index)
                            }
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                  <button
                    className='group -m-2 rounded-full p-2 outline-none'
                    type='button'
                    onClick={() => remove(index)}
                  >
                    <CircleX
                      strokeWidth={1.5}
                      className='text-red group-hover:fill-red group-hover:text-white group-focus-visible:fill-red group-focus-visible:text-white'
                    />
                  </button>
                </FormItem>
              ))}
            </div>
          ) : null}

          <div className='mt-2 flex flex-row flex-wrap items-center gap-x-4 gap-y-3'>
            <Button type='button' size='iconRight' onClick={addNewAnswer}>
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
        </form>
      </Form>
    </div>
  );
};

export default Page;
