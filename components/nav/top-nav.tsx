'use client';

import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { ModeToggle } from './theme-toggle'


export default function TopNav() {

    const {isSignedIn, user} = useUser()
    console.log({isSignedIn, user})

    return (
    <nav className='flex justify-between items-center p-2 shadow'>
        <Link href="/">AI</Link>
        <div className='flex items-center'>
            {isSignedIn && <Link href="/dashboard" className='mr-2'>{`${user.fullName}'s Dashboard`}</Link>}
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
            <div>
                <ModeToggle />
            </div>
        </div>
    </nav>
  )
}
