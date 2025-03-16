import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
import { Label } from '@radix-ui/react-label';
import { Button } from 'components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
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
import { useCreateTaskContext } from 'lib/context/CreateTaskProvider';
import { cn } from 'lib/utils';
import { CirclePlus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

const Toolbar = () => {
  return (
    <div className='mb-12 flex flex-row flex-wrap items-center justify-between gap-4'>
      <CreateTaskDialog />
      <div className='flex flex-wrap items-center gap-4'>
        <AssignStudentsDropdown />
        {/* <Button type='button' size='iconRight'>
          Assign Students
          <CirclePlus strokeWidth={1.5} width={20} />
        </Button> */}
        <DeleteAllQuestionsDialog />
      </div>
    </div>
  );
};

const CreateTaskDialog = () => {
  const { formData } = useCreateTaskContext();
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
        </DialogHeader>
        <DialogFooter>
          <Button
            type='submit'
            variant='default'
            onClick={() => {
              setOpen(false);
            }}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type Checked = DropdownMenuCheckboxItemProps['checked'];

const AssignStudentsDropdown = () => {
  const [open, setOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = React.useState<
    {
      id: string;
      name: string;
      selected: boolean;
    }[]
  >([
    { id: '1', name: 'John Doe', selected: false },
    { id: '2', name: 'Jane Smith', selected: false },
    { id: '3', name: 'Alice Johnson', selected: false },
    { id: '4', name: 'Bob Brown', selected: false },
    { id: '5', name: 'Charlie Davis', selected: false },
    { id: '6', name: 'Diana Evans', selected: false },
    {
      id: '7',
      name: 'Ethan Foster',
      selected: false,
    },
    { id: '8', name: 'Fiona Green', selected: false },
    { id: '9', name: 'George Harris', selected: false },
    { id: '10', name: 'Hannah Ivers', selected: false },
  ]);

  const studentsAssignedBool = selectedStudents.some(
    (student) => student.selected,
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(studentsAssignedBool && 'border-green text-green')}
          size='iconRight'
        >
          Assign Students
          <CirclePlus strokeWidth={1.5} width={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='min-w-44 max-w-72'>
        {/* <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator /> */}
        {selectedStudents.map((student) => (
          <DropdownMenuCheckboxItem
            onSelect={(event) => event.preventDefault()}
            key={student.id}
            checked={student.selected}
            onCheckedChange={(checked) => {
              setSelectedStudents((prev) =>
                prev.map((s) =>
                  s.id === student.id ? { ...s, selected: checked } : s,
                ),
              );
            }}
          >
            <Label>{student.name}</Label>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DeleteAllQuestionsDialog = () => {
  const { formData, handleRemoveAllQuestions } = useCreateTaskContext();
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          type='button'
          size='iconRight'
          variant='destructive'
          disabled={formData.items.length === 0}
        >
          Delete All Questions
          <Trash2 strokeWidth={1.5} height={20} />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Delete All Questions</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all questions? This action cannot
              be undone.
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
      </DialogPortal>
    </Dialog>
  );
};

export default Toolbar;
