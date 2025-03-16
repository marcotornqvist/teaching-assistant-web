import React, { createContext, useContext, useMemo } from 'react';
import type { CSSProperties, PropsWithChildren } from 'react';
import type {
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from 'lib/utils';
import { GripVertical } from 'lucide-react';

type Props = {
  id: UniqueIdentifier;
  className?: string;
};

type Context = {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
};

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export const SortableItem = ({
  children,
  id,
  className,
}: PropsWithChildren<Props>) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef],
  );
  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <li className={cn(className)} ref={setNodeRef} style={style}>
        {children}
      </li>
    </SortableItemContext.Provider>
  );
};

export const DragHandle = ({ className }: { className?: string }) => {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <button
      type='button'
      className={cn(className)}
      style={{ touchAction: 'none', WebkitTapHighlightColor: 'transparent' }}
      {...attributes}
      {...listeners}
      ref={ref}
    >
      <GripVertical
        strokeWidth={1.5}
        width={24}
        height={24}
        className='text-white'
      />
    </button>
  );
};
