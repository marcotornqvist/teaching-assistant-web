import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MultipleChoiceAnswer = z.object({
  text: z.string(),
  isCorrect: z.boolean(),
});

const TaskSchema = z.object({
  title: z.string(),
  questions: z.array(
    z.object({
      question: z.string(),
      answers: z.array(MultipleChoiceAnswer),
    }),
  ),
});

const RequestBody = z.object({
  content: z.string(),
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { content } = RequestBody.parse(body);

    if (!content.trim()) {
      return Response.json(
        { success: false, message: 'Content cannot be empty' },
        { status: 400 },
      );
    }

    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content:
            'You are a quiz builder that takes the text of the user and turns it into questions and multiple choice answers. Create at least 5 questions with 4 multiple choice answers each. Disregard the HTML tags and only use the text content.',
        },
        {
          role: 'user',
          content,
        },
      ],
      response_format: zodResponseFormat(TaskSchema, 'event'),
    });

    const event = completion.choices[0].message.parsed;

    if (!event) {
      throw new Error('Invalid response from OpenAI');
    }

    const questions = event?.questions.map((question) => {
      const answers = question.answers.map((answer) => ({
        answerId: Math.random().toString(36).substring(7),
        ...answer,
      }));

      return {
        questionId: Math.random().toString(36).substring(7),
        ...question,
        answers,
      };
    });

    return Response.json({
      success: true,
      message: 'Content received',
      data: {
        title: event.title,
        content,
        questions,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { success: false, message: 'Invalid request format' },
        { status: 400 },
      );
    }

    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
};
