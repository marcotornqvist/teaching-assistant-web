import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import taskData from 'lib/data/task.json';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 1. Import the mock data from /lib/data/task.json (before having the real data)
// 2. Get the questions and filter out only the answers which are correct.
// 3. With the correct answers, users can submit their answers and compare them with the correct answers and the original question to see if they are correct. Add a certaintity score to the answers to see how confident the AI is in the answer. The teacher will then be able to manually grade the answers. Perhaps the AI can also provide reasoning for the evaluation.
// 4. The teacher can then grade the answers and provide feedback to the user. The user can then see the feedback and the grade.

const QuestionSchema = z.object({
  feedbackResponse: z.string(),
  isCorrect: z.boolean(),
});

const RequestBody = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string(),
    }),
  ),
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { answers } = RequestBody.parse(body);

    if (!answers) {
      return Response.json(
        { success: false, message: 'Answers cannot be empty' },
        { status: 400 },
      );
    }

    const originalContent = taskData.data.content;

    const answeredQuestions = taskData.data.questions
      .map((question) => {
        const userAnswer = answers.find(
          (answer) => answer.questionId === question.questionId,
        );

        return {
          ...question,
          userAnswer,
        };
      })
      .filter((q) => q.userAnswer);

    const result = await Promise.all(
      answeredQuestions.map(async (q) => {
        const correctAnswers = q.answers.filter(
          (answer) => answer.isCorrect === true,
        );

        if (!q.userAnswer) {
          return null;
        }

        const completion = await openai.beta.chat.completions.parse({
          model: 'gpt-4o-2024-08-06',
          messages: [
            {
              role: 'system',
              content: `You are a teacher that goes through the students answer for a question. Use the original content and the correct answers as a reference to grade the students answer. Here is the original content which generated the question: ${originalContent}. Here is the question: ${q.question} Here are the answers:\n${correctAnswers
                .map((a) => `- ${a.text}`)
                .join('\n')}`,
            },
            {
              role: 'user',
              content: q.userAnswer.answer,
            },
          ],
          response_format: zodResponseFormat(QuestionSchema, 'event'),
        });

        const parsedSchema = completion.choices[0].message.parsed;

        return {
          ...q,
          ...parsedSchema,
        };
      }),
    );

    return Response.json({ success: true, data: result });
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
