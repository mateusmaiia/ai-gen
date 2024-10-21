'use client';

import React from 'react'
import { SignInButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { Button } from '../ui/button';
export default function PlanCard({name, image}: {name: string, image: string}) {
  const {isSignedIn, isLoaded} = useUser( )

  const handleCheckout = () => {

  }
  return (
    <div className='max-w-sm rounded overflow-hidden shadow-lg m-4 border'>
      <Image 
        width={100} 
        height={100} 
        className='m-5' 
        src={image}
        alt='monthly membership'
      />

      <div className='px-6 py-4'>
        <div className='font-bold text-lg mb-2'>
          Monthly Membership
        </div>
        <p className='text-gray-700 dark:text-gray-300 text-base'>
          Enjoy 
          {name === "Free" 
            ? "Limited AI generated content forever for just $0.00/monthly" 
            : "Unlimited  AI generated content forever for just $9.99/month"
          }
        </p>
        <ul className="mt-5 ml-3">
          <li>✨ {name == "Free" ? "Limited" : "Unlimited"} word generation</li>
          <li>🧠 Advanced AI features</li>
          <li>⚡ Faster processing times</li>
          <li>🛠️ {name == "Free" ? "" : "Priority"} customer support</li>
        </ul>
      </div>

      {!isLoaded ? "" : !isSignedIn ? (
        <div className="px-5 pb-10">
          <Button>
            <SignInButton />
          </Button>
        </div>
      ) : (
        <div className='px-5 pb-10'>
          <Button 
            onClick={handleCheckout}
          >
            Get Started
          </Button>
        </div>
      )}
    </div>
  )
}
 