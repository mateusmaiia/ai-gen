'use client';

import React, { useEffect, useRef, useState } from 'react'
// import { ArrowLeft } from 'lucide-react';
import template from '@/utils/template';
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { runAi, saveQuery } from '@/actions/ai'
import { Loader2Icon, ArrowLeft, Copy } from 'lucide-react'

import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/react-editor';
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useUser } from '@clerk/nextjs'

export interface Template{
  name: string;
  slug: string;
  icon: string;
  desc: string;
  category: string;
  aiPrompt: string;
  form: Form[];
}

export interface Form {
  label: string;
  field: string;
  name: string;
  required: boolean;
  
}

export default function Page({params}: {params: {slug: string}}) {
  const [query, setQuery] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const {user} = useUser()

  const email = user?.primaryEmailAddress?.emailAddress || ""

  const editorRef = useRef(null)

  useEffect(() => {
    if(content){
      const editorInstance = editorRef.current?.getInstance()
      editorInstance.setMarkdown(content)
    }
  }, [content])

  const t = template.find((item) => item.slug === params.slug) as Template

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
    setLoading(true)

    try {
      const data = await runAi(t.aiPrompt + query)
      setContent(data)
      //save to db
      await saveQuery(t, email, query, data )
    } catch (error) {
      console.log("handleSubmit error: ", error)
      setContent("An error accurred. Please try again.")
    }finally{
      console.log("content finally: ",content)
      setLoading(false)
    }
  }

  async function handleCopy(){
    const editorInstance = editorRef.current?.getInstance()
    const content = editorInstance.getMarkdown()
    
    try {
      await navigator.clipboard.writeText(content)
      toast.success("Content copied to clipboard")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <div className="flex justify-between mx-5 my-3">
        <Link href="/dashboard">
          <Button><ArrowLeft /> <span className='ml-2'>Back</span></Button>
        </Link>

        <Button onClick={handleCopy}>
          <Copy /> <span className='ml-2'>Copy</span>
        </Button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5 px-5 '>
          <div className='col-span-1 bg-slate-100 dark:bg-slate-900 rounded-md border p-5'>
            <div className='flex flex-col gap-3'>
              <Image 
                src={t.icon} 
                alt={t.name}
                width={50}
                height={50}
              />
              <h2 className='font-medium text-lg'>{t.name}</h2>
              <p className='text-gray-500'>{t.desc}</p>
            </div>

            <form className='mt-6' onSubmit={handleSubmit}>
              {t.form.map((item) => (
                <div key={item.name} className='mr-2 flex flex-col gap-2 mb-7'>
                  <label  className='font-bold pb-5'>{item.label}</label>

                  {item.field === 'input' ? (
                    <Input
                      name={item.name}
                      required={item.required}
                      onChange={e => setQuery(e.target.value)}
                    />
                  ): (
                    <Textarea 
                      name={item.name}
                      required={item.required}
                      onChange={e => setQuery(e.target.value)}
                    />
                  )}
                </div>
              ))}

              <Button type='submit' className='w-full py-6' disabled={loading}>
                {loading ? <Loader2Icon className='animate-spin mr-2' /> : "Generate Content"}
              </Button>
            </form>
          </div>

          <div className="col-span-2">
              <Editor 
                ref={editorRef}
                initValue={"Generated content will appear here."}
                previewStyle="vertical"
                height="600px"
                // initialValue=""
                useCommandShortcut={true}
                // onChange={() => setContent(editorRef.current?.getInstance().getMarkdown())}
              />
          </div>
        </div>
    </div>
  )
}
