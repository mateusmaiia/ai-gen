import PlanCard from '@/components/plan/plan-card'
import React from 'react'

export default function Membership() {
  return (
    <div>
      <h1 className='text-xl font-bold mt-10 text-center'>
        Upgrade with monthly membership
      </h1>

      <div className='flex flex-wrap justify-center'>
        <PlanCard name="Monthly" image="/monthly.jpg"/> 
        <PlanCard name="Free" image="/freejpg.jpg"/> 
      </div>
    </div>
  )
}
