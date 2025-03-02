'use client';

import { useEditor, EditorContent, mergeAttributes } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import ToolBar from './Toolbar';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from 'lib/utils';
import { useEffect } from 'react';
import { Markdown } from 'tiptap-markdown';

const Tiptap = ({
  placeholder,
  content,
  streamedContent,
  onChange,
  className,
}: {
  placeholder?: string;
  content: string;
  streamedContent?: string;
  onChange: (richText: string) => void;
  className?: string;
}) => {
  const editor = useEditor({
    extensions: [
      Markdown,
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
          class: 'text-sm',
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
        placeholder,
        emptyNodeClass:
          'first:before:text-grey first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none',
      }),
    ],
    immediatelyRender: false,
    content,
    editorProps: {
      attributes: {
        class: cn(
          'p-4 focus:outline-none min-h-full overflow-y-scroll',
          className,
        ),
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && streamedContent) {
      editor?.commands?.setContent(streamedContent);
    }
  }, [streamedContent]);

  return (
    <div className='flex h-96 min-h-full w-full flex-col justify-stretch rounded-md border border-grey bg-black focus-within:border-green hover:border-green'>
      <ToolBar editor={editor} />
      <EditorContent
        className='h-full overflow-hidden border-none outline-offset-4'
        editor={editor}
      />
    </div>
  );
};

export default Tiptap;
