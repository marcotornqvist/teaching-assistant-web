import { z } from 'zod';
import {
  CHATBOX_INPUT_MAX_LENGTH,
  GOOGLE_MODEL,
  MAX_ANSWERS,
  MAX_QUESTIONS,
  OPENAI_MODEL,
  STEP1_INPUT_MAX_LENGTH,
} from './constants';

export type ChatboxRequestData = z.infer<typeof ChatboxFormRequestSchema>;
export type ChatboxFormValues = z.infer<typeof ChatboxFormSchema>;
export type ModelValues = z.infer<typeof ModelsSchema>;

export const ModelsSchema = z.object({
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
    materialId: z.string().optional(),
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
    materialId: z.string().optional(),
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
    }),
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

export const Step1Schema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        text: z
          .string()
          .min(1, {
            message: 'Question must be at least 1 character long.',
          })
          .max(STEP1_INPUT_MAX_LENGTH, {
            message: `Question must be less than ${STEP1_INPUT_MAX_LENGTH} characters.`,
          }),
        hint: z
          .string()
          .max(STEP1_INPUT_MAX_LENGTH, {
            message: `Hint must be less than ${STEP1_INPUT_MAX_LENGTH} characters.`,
          })
          .nullable(),
        answers: z
          .array(
            z.object({
              id: z.string(),
              text: z
                .string()
                .min(1, {
                  message: 'Answer must be at least 1 character long.',
                })
                .max(STEP1_INPUT_MAX_LENGTH, {
                  message: `Answer must be less than ${STEP1_INPUT_MAX_LENGTH} characters.`,
                }),
              isCorrect: z.boolean(),
              errors: z.array(z.string()),
            }),
          )
          .min(1, {
            message: 'At least one answer is required.',
          })
          .max(MAX_ANSWERS, {
            message: 'A maximum of 10 answers is allowed per question.',
          }),
        textAnswer: z.boolean().default(false),
        errors: z.array(z.string()),
      }),
    )
    .min(1, { message: 'At least one question is required.' })
    .max(MAX_QUESTIONS, {
      message: 'A maximum of 50 questions is allowed.',
    }),
});

// Select the fields: question, hint, answers (text, isCorrect)

export const ChatTaskResponseSchema = z.object({
  items: z
    .array(
      Step1Schema.shape.items.element
        .omit({
          id: true,
          errors: true,
        })
        .extend({
          answers: z
            .array(
              Step1Schema.shape.items.element.shape.answers.element.omit({
                id: true,
                errors: true,
              }),
            )
            .min(1)
            .max(MAX_ANSWERS),
        }),
    )
    .min(1)
    .max(MAX_QUESTIONS),
});
