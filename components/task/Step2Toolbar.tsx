import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/ui/DropdownMenu';
import { cn } from 'lib/utils';
import { ArrowLeft, CirclePlus } from 'lucide-react';
import React, { useState } from 'react';
import { StepProps } from './Steps';

export const Step2Toolbar = ({
  step,
  setStep,
  isLoading,
  formData,
  setFormData,
  setIsLoading,
  children,
}: StepProps & {
  children?: React.ReactNode;
}) => {
  return (
    <div className='mb-12 flex flex-row flex-wrap items-center justify-between gap-4'>
      <Button
        onClick={() => setStep(1)}
        type='button'
        size='iconLeft'
        disabled={isLoading}
      >
        <ArrowLeft strokeWidth={1.5} />
        Modify Questions
      </Button>
      <div className='flex flex-row items-center gap-4'>
        {children}
        <CreateTaskDialog />
      </div>
    </div>
  );
};

const CreateTaskDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type='button' size='iconRight'>
          Create Task
          <CirclePlus strokeWidth={1.5} width={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            This will create a new task with the current questions and answers. 
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex flex-row flex-wrap gap-4'>
          <Button
            type='submit'
            variant='default'
            onClick={() => {
              setOpen(false);
            }}
          >
            Create Task
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Step2Toolbar;
