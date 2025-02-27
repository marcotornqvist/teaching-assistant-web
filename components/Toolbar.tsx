'use client';

import React from 'react';
import { type Editor } from '@tiptap/react';
import { Toggle } from './ui/Toggle';
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  StrikethroughIcon,
} from 'lucide-react';
import { Separator } from './ui/Separator';

type Props = {
  editor: Editor | null;
};

const ToolBar = ({ editor }: Props) => {
  if (!editor) {
    return null;
  }

  return (
    <div className='flex w-full items-center gap-4 overflow-x-scroll border-b border-grey px-2 py-1'>
      <Toggle
        pressed={editor.isActive('heading', { level: 1 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        <Heading1 className='h-4 w-4' />
      </Toggle>
      <Toggle
        pressed={editor.isActive('heading', { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className='h-4 w-4' />
      </Toggle>
      <Toggle
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className='h-4 w-4' />
      </Toggle>
      <Toggle
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className='h-4 w-4' />
      </Toggle>
      <Toggle
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <StrikethroughIcon className='h-4 w-4' />
      </Toggle>
      <Toggle
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className='h-4 w-4' />
      </Toggle>
      <Toggle
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className='h-4 w-4' />
      </Toggle>
      <Separator orientation='vertical' className='h-6' />
      <button
        className='h-10 px-2 outline-green disabled:opacity-50'
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <ArrowLeftFromLine width={16} height={16} strokeWidth={1.5} />
      </button>
      <button
        className='h-10 px-3 disabled:opacity-50'
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <ArrowRightFromLine width={16} height={16} strokeWidth={1.5} />
      </button>
    </div>
  );
};

export default ToolBar;
