import { Button } from 'components/ui/Button';
import { CirclePlus, CircleX } from 'lucide-react';
import React from 'react';

const Toolbar = () => {
  return (
    <div className='mb-12 flex flex-row items-center justify-between gap-4'>
      <Button type='submit' size='iconRight'>
        Create Task
        <CirclePlus strokeWidth={1.5} width={20} />
      </Button>
      <div className='flex items-center gap-4'>
        <Button type='button' size='iconRight'>
          Assign Students
          <CirclePlus strokeWidth={1.5} width={20} />
        </Button>
        <Button type='button' size='iconRight' variant='destructive'>
          Reset Task
          <CircleX strokeWidth={1.5} height={20} />
        </Button>
        <Button type='button' size='iconRight' variant='destructive'>
          Delete All Questions
          <CircleX strokeWidth={1.5} height={20} />
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
