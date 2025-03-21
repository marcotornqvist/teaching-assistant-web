'use client';

import CreateMaterialForm from './CreateMaterialForm';
import { experimental_useObject as useObject } from '@ai-sdk/react';

import Chatbox from 'components/misc/chat-box/Chatbox';
import { ChatMaterialResponseSchema } from 'lib/schema';

const Page = () => {
  const { isLoading, object, submit, stop } = useObject({
    api: '/api/materials/chat',
    schema: ChatMaterialResponseSchema,
  });

  return (
    <div className='pb-12'>
      <CreateMaterialForm
        streamedTitle={object?.title}
        streamedContent={object?.content}
      />
      <Chatbox submit={submit} isLoading={isLoading} stop={stop} />
    </div>
  );
};

export default Page;
