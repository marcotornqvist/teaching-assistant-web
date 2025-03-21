'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from 'components/ui/Form';
import { Paperclip, SendHorizontal, WandSparkles, X } from 'lucide-react';
import { cn } from 'lib/utils';
import {
  ChatboxFormSchema,
  ChatboxFormValues,
  ChatboxRequestData,
  ModelValues,
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
import { useState } from 'react';

const Chatbox = ({
  stop,
  submit,
  className,
  isLoading,
  materials,
}: {
  stop: () => void;
  submit: (data: ChatboxRequestData) => void;
  className?: string;
  isLoading: boolean;
  materials?: { id: string; name: string }[];
}) => {
  const [materialSelectOpen, setMaterialSelectOpen] = useState(false);
  const [modelSelectOpen, setModelSelectOpen] = useState(false);

  const form = useForm<ChatboxFormValues>({
    resolver: zodResolver(ChatboxFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldUnregister: false,
    defaultValues: {
      text: 'Create me a set of quiz questions about kendrick lamar.',
      model: GOOGLE_MODEL,
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmitWithFile = async (values: ChatboxFormValues) => {
    try {
      const payload: ChatboxRequestData = {
        text: values.text,
        materialId: undefined,
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
          <div className='mt-4 flex flex-wrap items-center justify-between gap-4'>
            <div className='flex items-center justify-start gap-3'>
              {materials ? (
                <FormField
                  control={form.control}
                  name='materialId'
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        defaultValue={field.value}
                        onOpenChange={setMaterialSelectOpen}
                        open={materialSelectOpen}
                      >
                        <FormControl>
                          <SelectTrigger
                            open={materialSelectOpen}
                            disabled={materials.length === 0}
                          >
                            <SelectValue placeholder='Select Material' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {materials.map((material) => (
                            <SelectItem
                              key={material.id}
                              value={material.id}
                              onClick={() => {
                                field.onChange(material.id);
                                // setMaterialSelectOpen(false);
                              }}
                            >
                              {material.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              ) : null}
              <FormField
                control={form.control}
                name='file'
                render={({ field: { onChange, value, ...field } }) => {
                  // Check if current model is Google to enable/disable file upload
                  const isGoogleModel = form.watch('model') === GOOGLE_MODEL;

                  return (
                    <FormItem>
                      <div
                        className={cn(
                          'group relative flex h-10 min-w-10 items-center rounded-md border border-dark-grey transition-colors',
                          isGoogleModel
                            ? 'focus-within:border-green focus-within:text-green hover:border-green hover:text-green'
                            : 'cursor-not-allowed opacity-50',
                        )}
                      >
                        <input
                          type='file'
                          id='file-upload'
                          onChange={(e) => {
                            if (!isGoogleModel) return;
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                            }
                          }}
                          disabled={!isGoogleModel}
                          className={cn(
                            'absolute inset-0 h-full w-full cursor-pointer opacity-0',
                            !isGoogleModel && 'cursor-not-allowed',
                          )}
                          {...field}
                        />
                        <label
                          htmlFor='file-upload'
                          className={cn(
                            'flex max-w-56 items-center justify-between gap-2.5 rounded-md px-2.5 focus-visible:outline-none',
                            isGoogleModel
                              ? 'cursor-pointer'
                              : 'cursor-not-allowed',
                          )}
                        >
                          <Paperclip
                            strokeWidth={1.5}
                            className={isGoogleModel ? 'hover:text-green' : ''}
                            width={20}
                            height={20}
                          />
                          {form.watch('file') && isGoogleModel ? (
                            <span className='text-sm truncate pr-1 group-hover:text-green'>
                              {form.watch('file')?.name}
                            </span>
                          ) : null}
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name='model'
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // If changing away from Google model, clear any existing file
                        if (value !== GOOGLE_MODEL && form.watch('file')) {
                          form.setValue('file', undefined);
                        }
                      }}
                      defaultValue={field.value}
                      onOpenChange={setModelSelectOpen}
                      open={modelSelectOpen}
                    >
                      <FormControl>
                        <SelectTrigger open={modelSelectOpen}>
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
            <div className='flex flex-1 flex-row items-center justify-end gap-4 lg:gap-6'>
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

export default Chatbox;
