import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { ChatboxFormSchema, ChatMaterialResponseSchema } from 'lib/schema';
export const maxDuration = 30;

export const POST = async (req: Request) => {
  const body = await req.json();
  const { text } = ChatboxFormSchema.parse(body);

  if (!text) {
    return Response.json(
      { errors: [{ message: 'Text cannot be empty' }] },
      { status: 400 },
    );
  }

  const result = streamObject({
    model: openai('gpt-4-turbo'),
    schema: ChatMaterialResponseSchema,
    system:
      'You are a teacher that is creating new materials for your students based on the prompt that was given.',
    prompt: `Please create a title and content based on the given text: "${text}".`,
  });

  return result.toTextStreamResponse();
};
