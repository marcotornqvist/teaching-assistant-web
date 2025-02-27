'use client';

import CreateMaterialForm from './CreateMaterialForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from 'components/ui/Form';
import { Paperclip, SendHorizontal, WandSparkles } from 'lucide-react';

const INPUT_MAX_AMOUNT = 2000;

const Page = () => {
  const formSchema = z.object({
    text: z.string().max(INPUT_MAX_AMOUNT, {
      message: `The text must not exceed ${INPUT_MAX_AMOUNT} characters`,
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: {
      text: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('/tasks/create/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: values.text }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className='pb-12'>
      <CreateMaterialForm />
      <div className='mt-24 flex w-full rounded-md bg-black p-4'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex w-full flex-1 flex-col'
          >
            <FormField
              control={form.control}
              name='text'
              render={({ field }) => (
                <FormItem className='flex flex-1 items-start gap-4 space-y-0'>
                  <div className='h-5 w-5 flex-shrink-0 pt-0.5' aria-hidden>
                    <WandSparkles
                      strokeWidth={1.5}
                      width={20}
                      height={20}
                      className='text-grey'
                    />
                  </div>
                  <FormControl>
                    <textarea
                      className='!mt-0 min-h-[200px] w-full resize-none bg-black text-sm leading-[150%] text-white outline-none placeholder:text-grey'
                      placeholder='Tell the AI what to make...'
                      maxLength={INPUT_MAX_AMOUNT}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='mt-4 flex items-center justify-between'>
              <button className='flex h-10 w-10 items-center justify-center rounded-md border border-dark-grey transition-colors hover:border-green hover:text-green focus-visible:border-green focus-visible:outline-none'>
                <Paperclip strokeWidth={1.5} width={20} height={20} />
              </button>
              <div className='flex flex-row items-center gap-4 lg:gap-6'>
                <span className='text-xs text-grey lg:text-sm'>
                  {form.watch('text')?.length || 0}/{INPUT_MAX_AMOUNT}
                </span>
                <button
                  type='submit'
                  className='flex h-10 w-10 items-center justify-center rounded-md bg-dark-grey transition-colors hover:bg-green focus-visible:bg-green focus-visible:outline-none'
                >
                  <SendHorizontal strokeWidth={1.5} width={20} height={20} />
                </button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
