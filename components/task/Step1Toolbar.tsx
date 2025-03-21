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
import { ArrowRight, Trash2 } from 'lucide-react';
import React from 'react';
import { StepProps } from './Steps';

type HandleNextPage = () => void;

export const Step1Toolbar = ({
  formData,
  setFormData,
  handleNextPage,
}: StepProps & {
  handleNextPage: HandleNextPage;
}) => {
  return (
    <div className='mb-12 flex flex-row flex-wrap items-center justify-between gap-4'>
      <DeleteAllQuestionsDialog formData={formData} setFormData={setFormData} />
      <NextPageButton handleNextPage={handleNextPage} formData={formData} />
    </div>
  );
};

export const NextPageButton = ({
  formData,
  handleNextPage,
}: {
  formData: StepProps['formData'];
  handleNextPage: () => void;
}) => {
  return (
    <Button
      type='button'
      size='iconRight'
      disabled={formData?.items?.length === 0}
      onClick={handleNextPage}
    >
      Add Details
      <ArrowRight strokeWidth={1.5} />
    </Button>
  );
};

const DeleteAllQuestionsDialog = ({
  formData,
  setFormData,
}: {
  formData: StepProps['formData'];
  setFormData: StepProps['setFormData'];
}) => {
  const [open, setOpen] = React.useState(false);

  const handleRemoveAllQuestions = (): void => {
    setFormData((prev) => ({
      ...prev,
      items: [],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          type='button'
          size='iconRight'
          variant='destructive'
          disabled={formData?.items?.length === 0}
        >
          Delete Questions
          <Trash2 strokeWidth={1.5} height={20} />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Delete Questions</DialogTitle>
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

export default Step1Toolbar;
