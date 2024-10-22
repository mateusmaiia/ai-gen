'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { usageCount } from "@/actions/ai";
import { useUser } from "@clerk/nextjs";
import { checkUserSubscrioption } from "@/actions/stripe";

 interface UsageContextType{
  count: number;
  fetchUsage: () => void;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  subscribed: boolean;
 }

 const UsageContext = createContext<UsageContextType | null>(null);

 export const UsageProvider = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  //state
  const [ count, setCount ] = useState(0)
  const [openModal, setOpenModal] = useState(false)  
  const [subscribed , setSubscribed] = useState(false) 
  //hooks
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress || ""
  //effects
  useEffect(() => {
    if(email) {
      fetchUsage()
      fetchSubscription()
    }
  }, [email])

  useEffect(() => {
    if(
      !subscribed && 
      count > Number(process.env.NEXT_PUBLIC_FREE_TIER_USAGE)) {
        setOpenModal(true)
      }else{
        setOpenModal(false)
      }
  },[count, subscribed])

  async function fetchUsage(){
    const res = await usageCount(email)
    console.log("fetchUsage, ",res)
    setCount(res)
  }

  const fetchSubscription = async () => {
    const response = checkUserSubscrioption()
    setSubscribed(response.ok || false)
  } 
  return (
    <UsageContext.Provider value={{count, fetchUsage, openModal, setOpenModal, subscribed}}>
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