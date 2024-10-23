'use client';

import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { ModeToggle } from './theme-toggle'
import { Toaster } from 'react-hot-toast'
import { useUsage } from '@/context/usage';
import Image from 'next/image';


export default function TopNav() {

    const { isSignedIn, user } = useUser()
    const { subscribed } = useUsage()
    console.log({isSignedIn, user})

    return (
    <nav className='flex justify-between items-center p-2 shadow border'>
        <Toaster />
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={100}
            height={50}
            className="cursor-pointer"
          />
        </Link>

        {!subscribed && (
          <Link href="/membership">🔥 Join free or $9.99/month </Link>
        )}

        <Link
          href="/"
        >
          Gen AI
        </Link>

        <div className='flex items-center'>
            {isSignedIn && (
              <Link href="/dashboard" className='mr-2'>
                {`${user.fullName}'s Dashboard`}
              </Link>
            )}
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
            <div className='ml-2'>
                <ModeToggle />
            </div>
        </div>
    </nav>
  )
}

