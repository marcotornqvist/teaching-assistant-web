'use client';

import ChatBox from 'components/misc/chat-box/ChatBox';
import TaskForm, { TaskFormData } from 'components/task/TaskForm';
import Toolbar from 'components/task/Toolbar';
import { CreateTaskProvider } from 'lib/context/CreateTaskProvider';
import { generateId } from 'lib/helpers/generateId';
import React, { useState } from 'react';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <CreateTaskProvider>
      <TaskForm />
      <ChatBox
        className='mt-0'
        submit={() => {}}
        isLoading={isLoading}
        stop={stop}
      />
    </CreateTaskProvider>
  );
};

export default Page;
