'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/Form';
import {
  Loader,
  Paperclip,
  SendHorizontal,
  WandSparkles,
  X,
} from 'lucide-react';
import { cn } from 'lib/utils';
import {
  ChatboxFormSchema,
  ChatboxFormValues,
  ChatboxRequestData,
} from 'lib/schema';
import {
  CHATBOX_INPUT_MAX_LENGTH,
  GOOGLE_MODEL,
  OPENAI_MODEL,
} from 'lib/constants';
import { fileToBase64 } from 'lib/helpers/fileToBase64';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/Select';

const ChatBox = ({
  stop,
  submit,
  className,
  isLoading,
}: {
  stop: () => void;
  submit: (data: ChatboxRequestData) => void;
  className?: string;
  isLoading: boolean;
}) => {
  const form = useForm<ChatboxFormValues>({
    resolver: zodResolver(ChatboxFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      text: 'Please compare the coin mentioned in the attachment and ethereum.',
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmitWithFile = async (values: ChatboxFormValues) => {
    try {
      const payload: ChatboxRequestData = {
        text: values.text,
        file: undefined,
        model: values.model,
      };

      if (values.file) {
        const fileData = await fileToBase64(values.file);

        payload.file = {
          name: values.file.name,
          type: values.file.type,
          data: fileData,
        };
      }

      submit(payload);
    } catch (error) {
      console.error('Error preparing file:', error);
    }
  };

  return (
    <div className={cn('mt-24 flex w-full rounded-md bg-black p-4', className)}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitWithFile)}
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
                    className='text-sm !mt-0 min-h-[200px] w-full resize-none bg-black leading-[150%] text-white outline-none placeholder:text-grey'
                    placeholder='Tell the AI what to make...'
                    maxLength={CHATBOX_INPUT_MAX_LENGTH}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='file'
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Upload a file</FormLabel>
                <FormControl>
                  <input
                    type='file'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                    className='border-input bg-background ring-offset-background file:bg-transparent placeholder:text-muted-foreground focus-visible:ring-ring text-sm w-full cursor-pointer rounded-md border px-3 py-2 file:text-sm file:border-0 file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='mt-4 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <button className='flex h-10 w-10 items-center justify-center rounded-md border border-dark-grey transition-colors hover:border-green hover:text-green focus-visible:border-green focus-visible:outline-none'>
                <Paperclip strokeWidth={1.5} width={20} height={20} />
              </button>
              <FormField
                control={form.control}
                name='model'
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={GOOGLE_MODEL} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={GOOGLE_MODEL}>
                          {GOOGLE_MODEL}
                        </SelectItem>
                        <SelectItem value={OPENAI_MODEL}>
                          {OPENAI_MODEL}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-row items-center gap-4 lg:gap-6'>
              <span className='text-xs text-grey lg:text-sm'>
                {form.watch('text')?.length || 0}/{CHATBOX_INPUT_MAX_LENGTH}
              </span>
              <button
                type='button'
                onClick={isLoading ? stop : form.handleSubmit(onSubmitWithFile)}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-md bg-dark-grey transition-colors focus-visible:outline-none',
                  isLoading
                    ? 'hover:bg-red focus-visible:bg-red'
                    : 'hover:enabled:bg-green focus-visible:enabled:bg-green disabled:opacity-50',
                  isSubmitting && !isLoading ? 'disabled:bg-green' : '',
                )}
                disabled={!isLoading && (!isValid || isSubmitting)}
              >
                {isLoading ? (
                  <X strokeWidth={1.5} />
                ) : (
                  <SendHorizontal strokeWidth={1.5} width={20} height={20} />
                )}
              </button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChatBox;
