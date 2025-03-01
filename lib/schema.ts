import { z } from 'zod';
import { CHATBOX_INPUT_MAX_LENGTH } from './constants';

export const ChatboxFormSchema = z.object({
  text: z
    .string()
    .nonempty()
    .max(CHATBOX_INPUT_MAX_LENGTH, {
      message: `The text must not exceed ${CHATBOX_INPUT_MAX_LENGTH} characters`,
    }),
  generateType: z.enum(['title', 'content', 'both']).default('both'),
});

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
