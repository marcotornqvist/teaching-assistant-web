'use client';

import CreateMaterialForm from './CreateMaterialForm';
import { experimental_useObject as useObject } from '@ai-sdk/react';

import ChatBox from 'components/misc/chat-box/ChatBox';
import { ChatMaterialResponseSchema } from 'lib/schema';

const Page = () => {
  const { isLoading, object, submit } = useObject({
    api: '/api/materials/chat',
    schema: ChatMaterialResponseSchema,
  });

  return (
    <div className='pb-12'>
      <CreateMaterialForm
        streamedTitle={object?.title}
        streamedContent={object?.content}
      />
      <ChatBox onSubmit={submit} isLoading={isLoading} />
    </div>
  );
};

export default Page;
