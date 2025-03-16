import React, {
  useId,
  useMemo,
  useState,
  createContext,
  useContext,
} from 'react';
import type { ReactNode } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  Active,
  UniqueIdentifier,
  DraggableSyntheticListeners,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';

import { SortableOverlay } from './SortableOverlay';
import { cn } from 'lib/utils';
import { GripVertical } from 'lucide-react';

type BaseList = {
  id: UniqueIdentifier;
};

type ContainerContextType = {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
};

const SortableContainerContext = createContext<ContainerContextType>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

type Props<T extends BaseList> = {
  lists: T[];
  onChange(lists: T[]): void;
  renderList(list: T): ReactNode;
  className?: string;
};

export const SortableContainer = <T extends BaseList>({
  lists,
  onChange,
  renderList,
  className,
}: Props<T>) => {
  const id = useId();
  const [active, setActive] = useState<Active | null>(null);
  const activeList = useMemo(
    () => lists.find((list) => list.id === active?.id),
    [active, lists],
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext
      id={id}
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = lists.findIndex(({ id }) => id === active.id);
          const overIndex = lists.findIndex(({ id }) => id === over.id);

          onChange(arrayMove(lists, activeIndex, overIndex));
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={lists}>
        <div role='application' className={cn(className)}>
          {lists.map((list) => (
            <React.Fragment key={list.id}>{renderList(list)}</React.Fragment>
          ))}
        </div>
      </SortableContext>
      <SortableOverlay>
        {activeList ? renderList(activeList) : null}
      </SortableOverlay>
    </DndContext>
  );
};

export const SortableContainerItem = ({
  id,
  children,
  className,
}: {
  id: UniqueIdentifier;
  children: ReactNode;
  className?: string;
}) => {
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

  const style = {
    opacity: isDragging ? 0.4 : undefined,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <SortableContainerContext.Provider value={context}>
      <div ref={setNodeRef} style={style} className={cn(className)}>
        {children}
      </div>
    </SortableContainerContext.Provider>
  );
};

export const ContainerDragHandle = ({ className }: { className?: string }) => {
  const { attributes, listeners, ref } = useContext(SortableContainerContext);

  return (
    <button
      className={cn(className)}
      style={{ touchAction: 'none', WebkitTapHighlightColor: 'transparent' }}
      {...attributes}
      {...listeners}
      ref={ref}
      type='button'
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
