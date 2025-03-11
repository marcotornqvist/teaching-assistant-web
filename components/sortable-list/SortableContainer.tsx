import React, { useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { Active, UniqueIdentifier } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';

import { SortableOverlay } from './SortableOverlay';

type BaseList = {
  id: UniqueIdentifier;
};

type Props<T extends BaseList> = {
  lists: T[];
  onChange(lists: T[]): void;
  renderList(list: T): ReactNode;
};

export const SortableContainer = <T extends BaseList>({
  lists,
  onChange,
  renderList,
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
        <div className='SortableContainer' role='application'>
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
}: {
  id: UniqueIdentifier;
  children: ReactNode;
}) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    opacity: isDragging ? 0.4 : undefined,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='SortableContainerItem'
    >
      {children}
    </div>
  );
};
