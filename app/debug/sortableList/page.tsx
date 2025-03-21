'use client';

import React, { useState } from 'react';

import { SortableList } from 'components/sortableList/SortableList';
import {
  SortableContainer,
  SortableContainerItem,
} from 'components/sortableList/SortableContainer';

export function createRange<T>(
  length: number,
  initializer: (index: number) => T,
): T[] {
  return [...new Array(length)].map((_, index) => initializer(index));
}

function getMockItems(prefix: string, count: number) {
  return createRange(count, (index) => ({
    id: `${prefix}-${index + 1}`,
    displayId: index + 1,
  }));
}

type ListData = {
  id: string;
  title: string;
  items: { id: string; displayId: number }[];
};

const Page = () => {
  const [lists, setLists] = useState<ListData[]>([
    { id: 'list-a', title: 'List A', items: getMockItems('a', 5) },
    { id: 'list-b', title: 'List B', items: getMockItems('b', 5) },
  ]);

  const handleListsChange = (newLists: ListData[]) => {
    setLists(newLists);
  };

  const handleItemsChange = (listIndex: number, newItems: any[]) => {
    const newLists = [...lists];
    newLists[listIndex] = {
      ...newLists[listIndex],
      items: newItems,
    };
    setLists(newLists);
  };

  return (
    <div style={{ width: '100%', maxWidth: 800, margin: '30px auto' }}>
      <h1>Nested Sortable Lists</h1>
      <p>
        You can drag items within lists and also drag the entire lists to
        reorder them.
      </p>
      <SortableContainer
        lists={lists}
        onChange={handleListsChange}
        renderList={(list) => (
          <SortableContainerItem id={list.id}>
            <div className='list-container border-gray-300 bg-gray-50 my-2.5 rounded border bg-white p-2.5'>
              <h2 className='text-black'>{list.title}</h2>
              <SortableList
                items={list.items}
                onChange={(items) => {
                  const index = lists.findIndex((l) => l.id === list.id);
                  handleItemsChange(index, items);
                }}
                renderItem={(item) => (
                  <SortableList.Item id={item.id}>
                    Item {item.displayId}
                    <SortableList.DragHandle />
                  </SortableList.Item>
                )}
              />
            </div>
          </SortableContainerItem>
        )}
      />
    </div>
  );
};

export default Page;
