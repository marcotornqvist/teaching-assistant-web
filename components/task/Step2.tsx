'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from 'components/ui/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/Form';
import { Input } from 'components/ui/Input';
import {
  ArrowLeft,
  ArrowRight,
  ChevronsDownUp,
  Eye,
  EyeOff,
  Lightbulb,
  Users,
} from 'lucide-react';
import Step2Toolbar, { CreateTaskDialog } from './Step2Toolbar';
import { StepProps } from './Steps';
import { Step1Schema } from './Step1';
import { Label } from '@radix-ui/react-label';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/ui/DropdownMenu';
import { cn } from 'lib/utils';
import { CirclePlus } from 'lucide-react';
import React from 'react';
import { RadioGroup, RadioGroupItem } from 'components/ui/RadioGroup';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/Dialog';

export const Step2Schema = z.object({
  // privacy: z.boolean().default(false),
  privacy: z.enum(['private', 'public', 'invite-only']).default('invite-only'),
  title: z
    .string()
    .min(3, {
      message: 'Title must be at least 3 characters.',
    })
    .max(200, {
      message: 'Title must be less than 200 characters.',
    }),
  students: z.array(z.string()),
  items: Step1Schema['shape'].items,
});

// Add toolbar
// Add question list for review
// Add task creation button
// Add delete task button
// Add make public button

type Step1FormData = z.infer<typeof Step2Schema>;

const items = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Alice Johnson' },
  { id: '4', name: 'Bob Brown' },
] as const;

const Page = (props: StepProps) => {
  const { setStep, formData } = props;

  const form = useForm<Step1FormData>({
    resolver: zodResolver(Step2Schema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldUnregister: false,
    defaultValues: {
      privacy: 'invite-only',
      title: '',
      students: [],
      items: formData.items,
    },
  });

  // Destructure isValid from formState
  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: Step1FormData) => {
    try {
      const response = await fetch('/api/task/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: values.title }),
      });

      if (!response.ok) {
        throw new Error('Failed to create material');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Failed to create material', error);
    }
  };

  const studentsAssignedBool = form.getValues('students').length > 0;

  const [showCollapsible, setShowCollapsible] = React.useState(false);

  const privacyMap = {
    private: {
      icon: <EyeOff width={20} height={20} strokeWidth={1.5} />,
      label: 'Private',
    },
    'invite-only': {
      icon: <Users width={20} height={20} strokeWidth={1.5} />,
      label: 'Invite Only',
    },
    public: {
      icon: <Eye width={20} height={20} strokeWidth={1.5} />,
      label: 'Public',
    },
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <Step2Toolbar {...props}>
            <Dialog>
              <DialogTrigger asChild>
                <Button type='button' size='iconRight'>
                  {privacyMap[form.watch('privacy')].label}
                  {privacyMap[form.watch('privacy')].icon}
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-[520px]'>
                <DialogHeader>
                  <DialogTitle>Select Privacy Settings</DialogTitle>
                  <DialogDescription>
                    Select if the task should be private (only visible to you),
                    invite only (visible to invited students), or public
                    (visible to everyone via link).
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className='flex flex-row flex-wrap gap-4'>
                    <FormField
                      control={form.control}
                      name='privacy'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Button
                              type='button'
                              size='iconRight'
                              onClick={() => {
                                field.onChange('private');
                              }}
                              className={cn(
                                field.value === 'private' &&
                                  'border-green text-green',
                              )}
                            >
                              Set Private
                              <EyeOff
                                width={20}
                                height={20}
                                strokeWidth={1.5}
                              />
                            </Button>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='privacy'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Button
                              type='button'
                              size='iconRight'
                              onClick={() => {
                                field.onChange('invite-only');
                              }}
                              className={cn(
                                field.value === 'invite-only' &&
                                  'border-green text-green',
                              )}
                            >
                              Set Invite Only
                              <Users width={20} height={20} strokeWidth={1.5} />
                            </Button>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='privacy'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Button
                              type='button'
                              size='iconRight'
                              onClick={() => {
                                field.onChange('public');
                              }}
                              className={cn(
                                field.value === 'public' &&
                                  'border-green text-green',
                              )}
                            >
                              Set Public
                              <Eye width={20} height={20} strokeWidth={1.5} />
                            </Button>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* This should become visible once the task has been published once so only on the edit page. */}
                  {/* {form.watch('privacy') &&
                  typeof window !== 'undefined' &&
                  window.location.origin ? (
                    <div className='text-sm-medium mt-4'>
                      Task can be accessed by anyone with this link:
                      <span className='text-blue'>
                        <br />
                        {`${window.location.origin}/task/123456`}
                      </span>
                    </div>
                  ) : null} */}
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <FormField
              control={form.control}
              name='items'
              render={() => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className={cn(
                        studentsAssignedBool && 'border-green text-green',
                      )}
                      size='iconRight'
                    >
                      Assign Students
                      <CirclePlus strokeWidth={1.5} width={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='max-h-[376px] min-h-[196px] min-w-48 max-w-72 overflow-y-auto'>
                    <DropdownMenuLabel>Select Students</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <FormItem>
                      {items.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name='students'
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className='flex flex-row items-start space-x-3 space-y-0'
                              >
                                <FormControl>
                                  <DropdownMenuCheckboxItem
                                    onSelect={(event) => event.preventDefault()}
                                    key={item.id}
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            item.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id,
                                            ),
                                          );
                                    }}
                                  >
                                    <Label>{item.name}</Label>
                                  </DropdownMenuCheckboxItem>
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            />
          </Step2Toolbar>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Title</FormLabel>
                <FormControl className='mt-1'>
                  <Input
                    placeholder='Type the title for the task here...'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='mt-20 flex flex-col gap-4'>
            {form.watch('items').map((item, index) => (
              <QuestionItem key={index} {...item} />
            ))}
          </div>
          <div className='flex w-full justify-end'>
            <CreateTaskDialog />
          </div>
        </form>
      </Form>
    </>
  );
};

const QuestionItem = ({ text, hint, answers }: Step1FormData['items'][0]) => {
  return (
    <div className='flex w-full flex-col rounded-md border bg-black p-3 lg:relative lg:p-5'>
      <h3 className='text-md mb-4'>{text}</h3>
      <div className='flex w-full flex-col gap-4 space-y-0'>
        {answers.map((answer, index) => (
          <div
            key={index}
            className={cn(
              'flex min-h-12 w-full items-center justify-between gap-4 space-y-0 rounded-md border px-3 py-2.5 lg:px-5',
              answer.isCorrect ? 'border-green' : 'border-red',
            )}
          >
            <span className='text-sm'>{answer.text}</span>
          </div>
        ))}
        {hint ? (
          <div
            className={cn(
              'text-sm flex min-h-12 w-full items-center justify-between gap-4 space-y-0 rounded-md border border-grey px-3 py-2.5 lg:px-5',
            )}
          >
            <span className='text-sm'>{hint}</span>
            <Lightbulb width={24} height={24} className='text-grey' />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Page;
