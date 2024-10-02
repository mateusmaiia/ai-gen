'use client';

import { LayoutDashboard, FileClock, WalletCards, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function SideNav() {
    const path = usePathname()
    const menu = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/dashboard"
        },
        {
            name: "History",
            icon: FileClock,
            path: "/dashboard/history"
        },
        {
            name: "Billing",
            icon:  WalletCards,
            path: "/dashboard/billing"
        },
        {
            name: "Settings",
            icon: Settings,
            path: "/dashboard/settings"
        },
    ]

    console.log(path)

  return (
    <div className='h-screen p-5 shadow-sm border'>
      {menu.map((item, index) => (
        <div key={index} className='flex m-2 mr-4 p-2 hover:bg-primary hover:text-white rounded-lg cursor-pointer'>
            <div className='flex'>
                <item.icon></item.icon> <span className='ml-2'>{item.name}</span>
            </div>
        </div>
      ))}
    </div>
  )
}
