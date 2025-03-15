'use client';

import TaskForm, { TaskFormData } from 'components/task/TaskForm';
import { generateId } from 'lib/helpers/generateId';
import React, { useState } from 'react';

const Page = () => {
  const [formData, setFormData] = useState<TaskFormData>({
    items: [
      {
        id: generateId(),
        text: 'What colors are in the Swedish flag? (Select all that apply)',
        hint: null,
        textAnswer: false,
        errors: [],
        answers: [
          {
            id: generateId(),
            text: 'Blue',
            isCorrect: false,
            errors: [],
          },
          {
            id: generateId(),
            text: 'Yellow',
            isCorrect: false,
            errors: [],
          },
          {
            id: generateId(),
            text: 'Red',
            isCorrect: false,
            errors: [],
          },
          {
            id: generateId(),
            text: 'Green',
            isCorrect: false,
            errors: [],
          },
        ],
      },
      {
        id: generateId(),
        text: 'What is the capital of Sweden?',
        hint: null,
        textAnswer: false,
        errors: [],
        answers: [
          {
            id: generateId(),
            text: 'Oslo',
            isCorrect: false,
            errors: [],
          },
          {
            id: generateId(),
            text: 'Helsinki',
            isCorrect: false,
            errors: [],
          },
          {
            id: generateId(),
            text: 'Stockholm',
            isCorrect: true,
            errors: [],
          },
          {
            id: generateId(),
            text: 'Copenhagen',
            isCorrect: false,
            errors: [],
          },
        ],
      },
    ],
  });

  return (
    <div>
      <TaskForm formData={formData} setFormData={setFormData} />
    </div>
  );
};

export default Page;
