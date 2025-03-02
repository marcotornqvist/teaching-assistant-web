'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from 'components/ui/Button';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/Form';
import { Base64FileData, FileUploadSchema } from 'lib/schema';
import { fileToBase64 } from 'lib/helpers/fileToBase64';

type FileUploadFormValues = z.infer<typeof FileUploadSchema>;

const UploadFile = () => {
  const { submit } = useObject({
    api: '/api/upload-file',
    schema: FileUploadSchema,
  });
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FileUploadFormValues>({
    resolver: zodResolver(FileUploadSchema),
    mode: 'onChange',
    defaultValues: {
      file: undefined,
    },
  });

  const onSubmit = async (values: FileUploadFormValues) => {
    try {
      setIsUploading(true);

      if (!values.file) {
        throw new Error('No file selected');
      }

      const fileData = await fileToBase64(values.file);

      const payload: Base64FileData = {
        file: {
          name: values.file.name,
          type: values.file.type,
          data: fileData,
        },
      };

      submit(payload);
    } catch (error) {
      console.error('Error preparing file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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
        <Button
          type='submit'
          disabled={isUploading || !form.formState.isValid}
          loading={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </form>
    </Form>
  );
};

export default UploadFile;
