import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { CreateMaterialFormSchema } from '../../../../lib/schema';

export const POST = async (req: Request) => {
  const context = await req.json();

  const result = streamObject({
    model: openai('gpt-4-turbo'),
    schema: CreateMaterialFormSchema,
    prompt:
      `Generate 3 notifications for a messages app in this context:` + context,
  });

  return result.toTextStreamResponse();
};
