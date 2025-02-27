'use client';

import { useEditor, EditorContent, mergeAttributes } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import ToolBar from './Toolbar';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from 'lib/utils';

const Tiptap = ({
  content,
  onChange,
  className,
}: {
  content: string;
  onChange: (richText: string) => void;
  className?: string;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-4',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-4',
          },
        },
      }),
      Paragraph.configure({
        HTMLAttributes: {
          class: 'text-base',
        },
      }),
      Heading.extend({
        levels: [1, 2],
        renderHTML({ node, HTMLAttributes }) {
          const level = this.options.levels.includes(node.attrs.level)
            ? node.attrs.level
            : this.options.levels[0];
          const classes: { [index: number]: string } = {
            1: 'text-xl',
            2: 'text-xl',
          };
          return [
            `h${level}`,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: `${classes[level]}`,
            }),
            0,
          ];
        },
      }).configure({ levels: [1, 2] }),
      Placeholder.configure({
        placeholder: "Write your article! You're the journalist.",
        showOnlyWhenEditable: false,
      }),
    ],
    immediatelyRender: false,
    content,
    editorProps: {
      attributes: {
        class: cn(
          'p-4 focus:outline-none h-[400px] lg:h-[300px] overflow-y-scroll',
          className,
        ),
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className='flex w-full flex-col justify-stretch rounded-md border border-grey bg-black focus-within:border-green hover:border-green'>
      <ToolBar editor={editor} />
      <EditorContent className='border-none outline-offset-4' editor={editor} />
    </div>
  );
};

export default Tiptap;
