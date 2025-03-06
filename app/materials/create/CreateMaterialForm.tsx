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
import { ArrowRight } from 'lucide-react';
import Tiptap from 'components/Tiptap';
import { CreateMaterialFormSchema } from 'lib/schema';
import { useEffect } from 'react';

type CreateMaterialFormValues = z.infer<typeof CreateMaterialFormSchema>;

const CreateMaterialForm = ({
  streamedTitle,
  streamedContent,
}: {
  streamedTitle?: string;
  streamedContent?: string;
}) => {
  const form = useForm<CreateMaterialFormValues>({
    resolver: zodResolver(CreateMaterialFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldUnregister: false,
    defaultValues: {
      title: '',
      content: '',
    },
  });

  // Destructure isValid from formState
  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: CreateMaterialFormValues) => {
    try {
      const response = await fetch('/api/materials/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: values.content }),
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

  useEffect(() => {
    if (streamedTitle && streamedTitle !== form.getValues('title')) {
      form.setValue('title', streamedTitle, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [streamedTitle, form]);

  useEffect(() => {
    if (streamedContent && streamedContent !== form.getValues('content')) {
      form.setValue('content', streamedContent, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [streamedContent, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder='Type the title for the material here...'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Tiptap
                  placeholder='Type the content for the material here...'
                  content={field.value}
                  onChange={field.onChange}
                  streamedContent={streamedContent}
                  isValid={form.formState.errors.content === undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex w-full justify-end'>
          <Button
            type='submit'
            size='iconRight'
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
          >
            Submit Material <ArrowRight width={20} height={20} />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateMaterialForm;
