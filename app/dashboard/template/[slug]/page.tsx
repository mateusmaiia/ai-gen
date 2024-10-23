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
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { marked } from 'marked'; // Importação do marked

export default function Page({ params }: { params: { slug: string } }) {
  const [query, setQuery] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const email = user?.primaryEmailAddress?.emailAddress || '';
  const { fetchUsage, subscribed, count } = useUsage();

  const t = template.find((item) => item.slug === params.slug) as Template | undefined;

  if (!t) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Template not found. Please go back to the dashboard.</p>
      </div>
    );
  }

  const handleEditorChange = ({ text }) => {
    setContent(text); // Atualiza o conteúdo com o texto do editor
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await runAi(t.aiPrompt + query);
      setContent(data); // Atualiza o conteúdo com a resposta da AI
      await saveQuery(t, email, query, data);
      fetchUsage();
    } catch (error) {
      console.log('handleSubmit error: ', error);
      setContent('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Content copied to clipboard');
    } catch (error) {
      console.log('handleCopy error:', error);
      toast.error('Failed to copy content.');
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

            <Button 
              type="submit" 
              className="w-full py-6" 
              disabled={loading || (!subscribed && count >= Number(process.env.NEXT_PUBLIC_FREE_TIER_USAGE))} 
            >
              {loading && <Loader2Icon className="animate-spin mr-2" />}
              {subscribed || count < Number(process.env.NEXT_PUBLIC_FREE_TIER_USAGE) ? (
                'Generate content'
              ) : (
                'Subscribe to generate content'
              )}
            </Button>
          </form>
        </div>

        <div className="col-span-2">
          <MarkdownEditor
            value={content}
            style={{ height: '400px' }}
            onChange={handleEditorChange}
            renderHTML={(text) => (
              <div dangerouslySetInnerHTML={{ __html: marked(text) }} /> // Usando o `marked` para renderizar HTML
            )}
          />
        </div>
      </div>
    </div>
  );
}
