'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem } from 'components/ui/Form';
import { Paperclip, SendHorizontal, WandSparkles } from 'lucide-react';
import { cn } from 'lib/utils';

const INPUT_MAX_LENGTH = 2000;

export const chatboxFormSchema = z.object({
  text: z
    .string()
    .nonempty()
    .max(INPUT_MAX_LENGTH, {
      message: `The text must not exceed ${INPUT_MAX_LENGTH} characters`,
    }),
});

const ChatBox = ({
  onSubmit,
  className,
}: {
  onSubmit: (data: z.infer<typeof chatboxFormSchema>) => void;
  className?: string;
}) => {
  const form = useForm<z.infer<typeof chatboxFormSchema>>({
    resolver: zodResolver(chatboxFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      text: '',
    },
  });

  const { isValid, isDirty, isSubmitting } = form.formState;

  return (
    <div className={cn('mt-24 flex w-full rounded-md bg-black p-4', className)}>
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
                    maxLength={INPUT_MAX_LENGTH}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className='mt-4 flex items-center justify-between'>
            <button className='flex h-10 w-10 items-center justify-center rounded-md border border-dark-grey transition-colors hover:border-green hover:text-green focus-visible:border-green focus-visible:outline-none'>
              <Paperclip strokeWidth={1.5} width={20} height={20} />
            </button>
            <div className='flex flex-row items-center gap-4 lg:gap-6'>
              <span className='text-xs text-grey lg:text-sm'>
                {form.watch('text')?.length || 0}/{INPUT_MAX_LENGTH}
              </span>
              <button
                type='submit'
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-md bg-dark-grey transition-colors focus-visible:outline-none hover:enabled:bg-green focus-visible:enabled:bg-green',
                  isSubmitting ? 'disabled:bg-green' : 'disabled:opacity-50',
                )}
                disabled={!isValid || !isDirty || isSubmitting}
              >
                <SendHorizontal strokeWidth={1.5} width={20} height={20} />
              </button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChatBox;
