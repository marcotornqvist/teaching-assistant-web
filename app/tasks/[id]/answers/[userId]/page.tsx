import React from 'react';

// Teachers can review the submitted answers for a task based on the userId who submitted it.

const Page = ({ id, userId }: { id: string; userId: string }) => {
  return (
    <div>
      Tasks {id} - {userId}
    </div>
  );
};

export default Page;
