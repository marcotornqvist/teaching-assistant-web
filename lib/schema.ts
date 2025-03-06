import { z } from 'zod';
import {
  CHATBOX_INPUT_MAX_LENGTH,
  GOOGLE_MODEL,
  OPENAI_MODEL,
} from './constants';

export type ChatboxRequestData = z.infer<typeof ChatboxFormRequestSchema>;
export type ChatboxFormValues = z.infer<typeof ChatboxFormSchema>;
export type ModelValues = z.infer<typeof ModelsSchema>;

const ModelsSchema = z.object({
  model: z
    .enum([GOOGLE_MODEL, OPENAI_MODEL], {
      message: 'Please select a valid model',
    })
    .default(GOOGLE_MODEL),
});

export const ChatboxFormSchema = z
  .object({
    text: z
      .string()
      .nonempty()
      .max(CHATBOX_INPUT_MAX_LENGTH, {
        message: `The text must not exceed ${CHATBOX_INPUT_MAX_LENGTH} characters`,
      }),
    file: z
      .instanceof(File, { message: 'Please select a file' })
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: 'File size must be less than 5MB',
      })
      .refine((file) => ['application/pdf'].includes(file.type), {
        message: 'Only PDFs are supported',
      })
      .optional(),
    ...ModelsSchema.shape,
  })
  .superRefine((data, ctx) => {
    // If file is provided but model is not GOOGLE_MODEL, add an issue
    if (data.file && data.model !== GOOGLE_MODEL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Files can only be uploaded when using the Google model',
        path: ['file'],
      });
    }
  });

export const ChatboxFormRequestSchema = z
  .object({
    text: z
      .string()
      .nonempty()
      .max(CHATBOX_INPUT_MAX_LENGTH, {
        message: `The text must not exceed ${CHATBOX_INPUT_MAX_LENGTH} characters`,
      }),
    file: z
      .object({
        name: z.string().min(1, { message: 'Filename is required' }),
        type: z.string().refine((type) => ['application/pdf'].includes(type), {
          message: 'Only PDF documents are supported',
        }),
        data: z
          .string()
          .min(1, { message: 'File data is required' })
          .refine((data) => data.startsWith('data:'), {
            message: 'Invalid base64 data format',
          }),
      })
      .optional(),
    ...ModelsSchema.shape,
  })
  .superRefine((data, ctx) => {
    // If file is provided but model is not GOOGLE_MODEL, add an issue
    if (data.file && data.model !== GOOGLE_MODEL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Files can only be uploaded when using the Google model',
        path: ['file'],
      });
    }
  });

export const FileUploadSchema = z.object({
  file: z
    .instanceof(File, { message: 'Please select a file' })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size must be less than 5MB',
    })
    .refine((file) => ['application/pdf'].includes(file.type), {
      message: 'Only PDF documents are supported',
    }),
});

export const Base64FileSchema = z.object({
  file: z.object({
    name: z.string().min(1, { message: 'Filename is required' }),
    type: z.string().refine((type) => ['application/pdf'].includes(type), {
      message: 'Only PDF documents are supported',
    }),
    data: z
      .string()
      .min(1, { message: 'File data is required' })
      .refine((data) => data.startsWith('data:'), {
        message: 'Invalid base64 data format',
      }),
  }),
});

// Type for the transformed data that will be sent to the server
export type Base64FileData = z.infer<typeof Base64FileSchema>;

export const CreateMaterialFormSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: 'Title must be at least 3 characters.',
    })
    .max(200, {
      message: 'Title must be less than 200 characters.',
    }),
  content: z
    .string()
    .min(50, {
      message: 'Content must be at least 50 characters.',
    })
    .max(200000, {
      message: 'Content must be less than 200,000 characters.',
    })
    .trim(),
});

export const ChatMaterialResponseSchema = CreateMaterialFormSchema.pick({
  title: true,
  content: true,
}).extend({
  title: z
    .string()
    .describe(
      'Title of the chat material. Title must be at least 3 characters and less than 200 characters.',
    ),
  content: z
    .string()
    .describe(
      'Content of the chat material. Content must be at least 50 characters and less than 200,000 characters.',
    ),
});
