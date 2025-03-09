import React from 'react';
import { Button } from '../Button';

const QuizItem = () => {
  return (
    <div>
      <input />
      <div className='flex flex-row items-center gap-4'>
        <Button>Add Answer</Button>
        <Button>Add Answer</Button>
        <Button>Add Answer</Button>
        <Button>Add Answer</Button>
      </div>
    </div>
  );
};

export default QuizItem;
