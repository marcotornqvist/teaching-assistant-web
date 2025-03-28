import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { CoreMessage, streamObject } from 'ai';
import {
  ChatboxFormRequestSchema,
  ChatMaterialResponseSchema,
} from 'lib/schema';
import { GOOGLE_MODEL, OPENAI_MODEL } from 'lib/constants';

export const maxDuration = 30;

export const POST = async (req: Request) => {
  const body = await req.json();
  const parsedBody = ChatboxFormRequestSchema.parse(body);

  if (!parsedBody) {
    return Response.json(
      { errors: [{ message: 'Invalid request body' }] },
      { status: 400 },
    );
  }

  const { text, file, model } = parsedBody;

  const messages: CoreMessage[] = [];

  if (file?.data && model === GOOGLE_MODEL) {
    messages.push(
      {
        role: 'system',
        content: `You are a teacher that is creating new materials for your students based on the prompt and PDF attachment that was given. Respond to the user with the user input language. Please create material with this format:
        1. Start with a clear, concise title
        2. Follow with well-organized content that explains the subject matter
        3. Use only plain text in your response (no markdown or formatting)`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Based on the uploaded PDF file and the following text: "${text}"`,
          },
          {
            type: 'file',
            data: file.data,
            mimeType: 'application/pdf',
          },
        ],
      },
    );
  } else {
    messages.push(
      {
        role: 'system',
        content: `You are a teacher that is creating new materials for your students based on the prompt that was given. Respond to the user with the user input language. Please create material with this format:
        1. Start with a clear, concise title
        2. Follow with well-organized content that explains the subject matter
        3. Use only plain text in your response (no markdown or formatting)`,
      },
      {
        role: 'user',
        content: `Please create a title first and then content based on the given text: "${text}".`,
      },
    );
  }

  const result = streamObject({
    model: model === OPENAI_MODEL ? openai(OPENAI_MODEL) : google(GOOGLE_MODEL),
    schema: ChatMaterialResponseSchema,
    messages,
    onError: ({ error }) => {
      console.error(error);
    },
    // onFinish: ({ object }) => {
    //   const res = ChatMaterialResponseSchema.safeParse(object);
    //   if (res.error) {
    //     throw new Error(res.error.errors.map((e) => e.message).join('\n'));
    //   }
    // },
  });

  return result.toTextStreamResponse();
};
