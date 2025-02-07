import React from 'react';

// Users can view and do the task by id here. Teachers can also edit or delete the task. (do users first).
// Call the task route api and get the task by id. 

const Page = ({ id }: { id: string }) => {
  return <div>Task {id}</div>;
};

export default Page;
