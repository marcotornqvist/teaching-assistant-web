import { Textarea } from 'components/ui/Textarea';
import { cn } from 'lib/utils';
import { useRef, useEffect } from 'react';

const TextareaDynamicHeight = ({
  className,
  ...props
}: React.ComponentProps<'textarea'> & {
  className?: string;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [props.value]);

  return (
    <Textarea
      {...props}
      ref={textareaRef}
      rows={1}
      style={{
        width: '100%',
        resize: 'none',
        overflow: 'hidden',
      }}
      className={cn(className)}
    />
  );
};

export default TextareaDynamicHeight;
