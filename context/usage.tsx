'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { usageCount } from "@/actions/ai";
import { useUser } from "@clerk/nextjs";

 interface UsageContextType{
  count: number;
  fetchUsage: () => void;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
 }

 const UsageContext = createContext(null);

 export const UsageProvider = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  //state
  const [ count, setCount ] = useState<UsageContextType | null>(null)
  const [openModal, setOpenModal] = useState(false)  
  //hooks
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress || ""

  //effects
  useEffect(() => {
    if(email) fetchUsage()
  }, [email])

  useEffect(() => {
    if(count > 100) setOpenModal(true)
  },[count])

  async function fetchUsage(){
    const res = await usageCount(email)
    console.log("fetchUsage, ",res)
    setCount(res)
  }
  return (
    <UsageContext.Provider value={{count, fetchUsage, openModal, setOpenModal}}>
      {children}
    </UsageContext.Provider>
  )
}

export const useUsage = () => {
  const context = useContext(UsageContext)
  if(context === null){
    throw new Error("useUsage must be used within a UsageProvider")
  }
  return context;
}