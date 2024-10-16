'use client';

import { useUsage } from "@/context/usage";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Usage(){
  const {count} = useUsage()

  const  credits = 10000
  const percentage = (count / credits) * 100

  return(
    <div className="m-2">
      <div className="rounded-lg shadow border p-2">
        <h2 className="font-medium">Credits</h2>

        <div className="h-2 bg-slate-500 w-full rounded-full mt-3">
          <div className="h-2 bg-slate-200 rounded-full" style={{width:`${percentage}%`}}></div>
        </div>

        <h2 className="text-sm my-2">
          {count} / {credits} credit used
        </h2>

        <Link href="/membership">
          <Button className="w-full my-3" variant="secondary">Upgrade</Button>
        </Link>
      </div>
    </div>
  )
}