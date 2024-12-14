import React from 'react';

// Users can view the task by id here. Teachers can also edit or delete the task.

const Page = ({ id }: { id: string }) => {
  return <div>Task {id}</div>;
};

export default Page;
