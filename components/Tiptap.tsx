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
  isValid,
  className,
}: {
  placeholder?: string;
  content: string;
  streamedContent?: string;
  onChange: (richText: string) => void;
  isValid?: boolean;
  className?: string;
}) => {
  const editor = useEditor({
    extensions: [
      Markdown.configure({
        transformPastedText: true, // Allow to paste markdown text in the editor
        transformCopiedText: true, // Copied text is transformed to markdown
        breaks: true,
      }),
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
        class: cn('p-4 focus:outline-none h-full overflow-y-scroll', className),
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && streamedContent) {
      // Clean up the content by removing extra whitespace
      const cleanedContent = streamedContent
        .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
        .replace(/\n\s*\n+/g, '\n\n') // Replace multiple newlines with just two
        .trim(); // Remove leading/trailing whitespace

      // Set the cleaned content
      editor.commands.setContent(cleanedContent);
    }
  }, [streamedContent, editor]);

  return (
    <div
      className={cn(
        'flex h-96 w-full flex-col justify-stretch rounded-md border border-grey bg-black focus-within:border-green hover:border-green',
        {
          'border-red hover:border-red focus-visible:outline-red': !isValid,
        },
        className,
      )}
    >
      <ToolBar editor={editor} />
      <EditorContent
        className='h-full overflow-hidden border-none outline-offset-4'
        editor={editor}
      />
    </div>
  );
};

export default Tiptap;
