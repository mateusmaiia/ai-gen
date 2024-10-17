'use client';

import React, { useEffect, useState } from 'react';
import template from '@/utils/template';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { runAi, saveQuery } from '@/actions/ai';
import { Loader2Icon, ArrowLeft, Copy } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';
import { Template } from '@/utils/types';
import { useUsage } from '@/context/usage';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Import TipTap components
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-4 py-2 rounded-md transition-colors ${editor.isActive('bold') ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`px-4 py-2 rounded-md transition-colors ${editor.isActive('italic') ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        Italic
      </button>
      {/* Adicione outros botões conforme necessário */}
    </div>
  );
};

export default function Page({ params }: { params: { slug: string } }) {
  const [query, setQuery] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const email = user?.primaryEmailAddress?.emailAddress || '';

  const { fetchUsage } = useUsage();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Color.configure({ types: [TextStyle.name] }),
      TextStyle,
    ],
    content: content || 'Generated content will appear here.',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const t = template.find((item) => item.slug === params.slug) as Template;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await runAi(t.aiPrompt + query);
      setContent(data);
      // Save to db
      await saveQuery(t, email, query, data);
      fetchUsage();
    } catch (error) {
      console.log('handleSubmit error: ', error);
      setContent('An error occurred. Please try again.');
    } finally {
      console.log('content finally: ', content);
      setLoading(false);
    }
  };

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Content copied to clipboard');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className="flex justify-between mx-5 my-3">
        <Link href="/dashboard">
          <Button>
            <ArrowLeft /> <span className="ml-2">Back</span>
          </Button>
        </Link>

        <Button onClick={handleCopy}>
          <Copy /> <span className="ml-2">Copy</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-5">
        <div className="col-span-1 bg-slate-100 dark:bg-slate-900 rounded-md border p-5">
          <div className="flex flex-col gap-3">
            <Image src={t.icon} alt={t.name} width={50} height={50} />
            <h2 className="font-medium text-lg">{t.name}</h2>
            <p className="text-gray-500">{t.desc}</p>
          </div>

          <form className="mt-6" onSubmit={handleSubmit}>
            {t.form.map((item) => (
              <div key={item.name} className="mr-2 flex flex-col gap-2 mb-7">
                <label className="font-bold pb-5">{item.label}</label>

                {item.field === 'input' ? (
                  <Input
                    name={item.name}
                    required={item.required}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                ) : (
                  <Textarea
                    name={item.name}
                    required={item.required}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                )}
              </div>
            ))}

            <Button type="submit" className="w-full py-6" disabled={loading}>
              {loading ? <Loader2Icon className="animate-spin mr-2" /> : 'Generate Content'}
            </Button>
          </form>
        </div>

        <div className="col-span-2">
          <MenuBar editor={editor} />
          <div className="prose prose-lg dark:prose-invert bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-md p-4 min-h-[300px] focus:outline-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-lg dark:prose-invert">{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
} 
