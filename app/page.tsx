import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SignInModal from "@/components/modal/sign-in-modal";
 
export default function Home() {
  return (
    <div
      className="relative bg-cover bg-center"
      style={{ backgroundImage: 'url("/background.png")', height: "50vh" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#010818] z-0"></div>
 
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <SignInModal />
          <h1 className="text-white text-7xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Content Generator
          </h1>
          <p className="text-white mb-5">
            Generate AI content for your blog, website, or social media with a
            single click and more
          </p>
          <Link href="/dashboard">
            <Button variant="outline">Get started</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
