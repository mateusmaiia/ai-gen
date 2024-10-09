import React from 'react'
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';


interface QueryResponse {
  _id: string;
  template: any;
  email: string;
  query: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Props{
  data: QueryResponse[];
}

function wordCount(text: string){
  return text.split("").length
}
export default function QueryTable({data}: Props) {
  
  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy");
      });
  }
  

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full bg-white dark:bg-gray-800 text-sm'>
        <thead>
          <tr>
            <th className='py-2 px-4 border-b text-left'>TEMPLATE</th>
            <th className='py-2 px-4 border-b text-left'>QUERY</th>
            <th className='py-2 px-4 border-b text-left'>DATE</th>
            <th className='py-2 px-4 border-b text-left'>WORDS</th>
            <th className='py-2 px-4 border-b text-left'>COPY</th>
           </tr> 
        </thead>
        <tbody>
          {data.map((item) => (
            <tr 
              key={item._id} 
              className='hover:bg-100 dark:bg-gray-600'
            >
              <td className='py-2 px-4 border-b'>
                <div className='flex items-center'>
                  <Image 
                    src={item.template.icon} 
                    alt='icon' 
                    height={20}  
                    width={20}
                  />
                  <div className='ml-2'>{item.template.name}</div>
                </div>
              </td>
              <td className='py-2 px-4 border-b line-clamp-2'>
                {item.query}
              </td>
              <td className='py-2 px-4 border-b '>
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
              <td className='py-2 px-4 border-b'>
                {wordCount(item.content)}
              </td>
              <td className='py-2 px-4 border-b'>
                <button onClick={() => handleCopy(item.content)} className='flex items-center'>
                  <Copy className='h-5 w-5 text-gray-500 dark:text-gray-300 mr-1' />
                  <span>Copy</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
