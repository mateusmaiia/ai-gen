'use client'

import {runAi} from "@/actions/ai"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
export default function Home() {
  const [response, setResponse ] = useState("")
  const [loading, setLoading ] = useState(false)
  const [query, setQuery ] = useState("")

  const handleClick = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await runAi(query)
      setResponse(data)
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className='m-5'>
      <form onSubmit={handleClick}>
        <Input 
          className='mb-5' 
          placeholder='Ask anything!' 
          value={query} 
          onChange={e => setQuery(e.target.value)}
        />

        <Button>Generate with AI</Button>
      </form>


      <Card className='mt-5'>
        <CardHeader>AI Response</CardHeader>
        <CardContent>
          {loading ? <div>Loading...</div> : <div>{response}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
 