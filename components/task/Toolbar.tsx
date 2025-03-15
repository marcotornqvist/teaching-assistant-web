import { Label } from '@radix-ui/react-label';
import { Button } from 'components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/Dialog';
import { useCreateTaskContext } from 'lib/context/CreateTaskProvider';
import { CirclePlus, CircleX } from 'lucide-react';
import { Input } from 'postcss';
import React from 'react';

const Toolbar = () => {
  return (
    <div className='mb-12 flex flex-row flex-wrap items-center justify-between gap-4'>
      <Button type='submit' size='iconRight'>
        Create Task
        <CirclePlus strokeWidth={1.5} width={20} />
      </Button>
      <div className='flex flex-wrap items-center gap-4'>
        <Button type='button' size='iconRight'>
          Assign Students
          <CirclePlus strokeWidth={1.5} width={20} />
        </Button>
        <Button type='button' size='iconRight' variant='destructive'>
          Reset Task
          <CircleX strokeWidth={1.5} height={20} />
        </Button>
        <DeleteAllQuestionsDialog />
      </div>
    </div>
  );
};

const DeleteAllQuestionsDialog = () => {
  const { handleRemoveAllQuestions } = useCreateTaskContext();
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          type='button'
          size='iconRight'
          variant='destructive'
        >
          Delete All Questions
          <CircleX strokeWidth={1.5} height={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Delete All Questions</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete all questions? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type='button'
            variant='destructive'
            onClick={() => {
              handleRemoveAllQuestions();
              setOpen(false);
            }}
          >
            Delete Questions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Toolbar;
