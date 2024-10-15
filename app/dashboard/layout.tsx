import SideNav from '@/components/nav/side-nav'
import React from 'react'

export default function DashboardLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <div className='flex h-screen'>
        <div className='w-1/4 h-full'>
            <SideNav />
        </div>
        <div className='flex-1 overflow-y-auto'>
            {children}
        </div>
    </div>
  )
}
