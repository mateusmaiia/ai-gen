import SideNav from '@/components/nav/side-nav'
import React from 'react'

export default function DashboardLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <div className='grid grid-cols-4 gap-4'>
        <div className='col-span-1'>
            <SideNav />
        </div>
        <div className='col-span-3'>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore beatae eveniet repudiandae ab atque architecto sunt, exercitationem laboriosam vel, non nesciunt eius voluptatum, ea dolorum ex! Explicabo illum aut voluptatem?
            </p>
            {children}
        </div>
    </div>
  )
}
