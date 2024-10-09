'use client';

import React, { useEffect, useState } from 'react'
import { Loader2Icon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { getQueries } from '@/actions/ai';

export default function History() {

  const [queries, setQueries] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(2)
  const [laoding, setLaoding] = useState(false)

  interface QueryResponse {
    queries: [],
    totalPages: number;
  }

  //hooks
  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress || ""

  useEffect(() => {
    if(page === 1 && email) fetchQueries()
  }, [page, email])

  async function fetchQueries(){
    setLaoding(true)
    try {
      const res = await (getQueries(email, page, perPage)) as QueryResponse
      setQueries(res.queries)
      setTotalPages(res.totalPages)
    } catch (error) {
      console.log("fetchQueries error, ",error)
    }finally {
      setLaoding(false)
    }
  }

  if(!queries.length){
    return (
      <div className='flex flex-col justify-center items-center h-screen gap-2'>
        <Loader2Icon className='animate-spin mx-2' />
        <p className='text-sm text-gray-500'>Loading...</p>
      </div>
    )
  }
  return (
    <div className='p-10 my-5 mx-5 mb-5 rounded-lg bg-slate-200 dark:bg-slate-800 flex flex-col justify-center items-center gap-2'>
      <h1 className='text-xl'>History</h1>
      <p className='text-sm text-gray-500'>Your previous search history</p>
      <pre>
        {/* {JSON.stringify(queries, null, 4)} */}
        {queries.length}
      </pre>
    </div>
  )
}
