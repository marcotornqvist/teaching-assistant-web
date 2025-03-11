import React, { createContext, useContext, useMemo } from 'react';
import type { CSSProperties, PropsWithChildren } from 'react';
import type {
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Props = {
  id: UniqueIdentifier;
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

export const SortableItem = ({ children, id }: PropsWithChildren<Props>) => {
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
      <li
        className='text-base flex grow list-none items-center justify-between rounded bg-white px-5 py-[18px] font-normal text-black shadow'
        ref={setNodeRef}
        style={style}
      >
        {children}
      </li>
    </SortableItemContext.Provider>
  );
};

export const DragHandle = () => {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <button
      className='bg-transparent focus-visible:ring-blue-400 flex w-3 flex-none cursor-pointer appearance-none items-center justify-center rounded-md border-0 p-[15px] outline-none hover:bg-black/5 focus-visible:ring-2'
      style={{ touchAction: 'none', WebkitTapHighlightColor: 'transparent' }}
      {...attributes}
      {...listeners}
      ref={ref}
    >
      <svg
        viewBox='0 0 20 20'
        width='12'
        className='fill-gray-400 m-auto h-full flex-none overflow-visible'
      >
        <path d='M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z'></path>
      </svg>
    </button>
  );
};
