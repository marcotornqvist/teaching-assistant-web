'use client';

import CreateMaterialForm from './CreateMaterialForm';
import { z } from 'zod';

import ChatBox, { chatboxFormSchema } from 'components/misc/chat-box/ChatBox';

const Page = () => {
  const onSubmit = async (values: z.infer<typeof chatboxFormSchema>) => {
    try {
      const response = await fetch('/api/materials/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: values.text }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className='pb-12'>
      <CreateMaterialForm />
      <ChatBox onSubmit={onSubmit} />
    </div>
  );
};

export default Page;
