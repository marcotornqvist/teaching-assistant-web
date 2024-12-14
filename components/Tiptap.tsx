'use client';

import { useEditor, EditorContent, mergeAttributes } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
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
      Heading.extend({
        levels: [1, 2],
        renderHTML({ node, HTMLAttributes }) {
          const level = this.options.levels.includes(node.attrs.level)
            ? node.attrs.level
            : this.options.levels[0];
          const classes: { [index: number]: string } = {
            1: 'text-2xl',
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
          'rounded-md border border-input bg-background focus:ring-offset-2 disabled:cursor-not-allows disabled:opacity-50 p-3',
          className,
        ),
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
      console.log(editor.getHTML());
    },
  });

  return (
    <div className='flex flex-col justify-stretch'>
      <ToolBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
