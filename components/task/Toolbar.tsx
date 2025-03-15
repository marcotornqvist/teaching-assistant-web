import { Button } from 'components/ui/Button';
import React from 'react';

const Toolbar = () => {
  return (
    <div className='mb-4 flex gap-4'>
      {/* Should open a modal */}
      <Button type='submit'>Create Task</Button>
      <Button type='submit'>Create Task</Button>
      <Button type='submit'>Create Task</Button>
    </div>
  );
};

export default Toolbar;
