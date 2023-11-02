"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BsGoogle, BsGithub } from "react-icons/bs"

const LandingPage = () => {
  const router = useRouter()

  const handleGetStarted = () => {}

  return (
    <main className="h-full w-full bg-white">
      <div className="flex h-full w-full flex-col items-center justify-center space-y-6">
        <Image src={"/images/logo.png"} width={100} height={100} alt="Logo" />
        <div className="text-center tracking-tight">
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-4xl">
            Welcome to Dbudget!
          </h1>
          <p className="text-lg text-zinc-900 sm:text-xl">
            The budgeting app for the rest of us.
          </p>
        </div>

        <div className="my-6 flex w-full items-center justify-center">
          <hr className="border-1 w-[70px] border-gray-300 sm:w-[100px]" />
          <span className="mx-3 font-medium text-gray-500">Continue with</span>
          <hr className="border-1 w-[70px] border-gray-300 sm:w-[100px]" />
        </div>

        <div className="flex w-[200px] flex-col space-y-2 sm:w-[300px]">
          <button
            onClick={handleGetStarted}
            className="flex w-full items-center justify-center rounded-full border border-lime-500 bg-lime-50 px-5 py-3 text-lg font-semibold tracking-tight text-zinc-900 hover:opacity-75 hover:shadow-sm"
          >
            <BsGoogle className="mr-3" />
            Google
          </button>
          <button
            onClick={handleGetStarted}
            className="flex w-full items-center justify-center rounded-full border border-lime-500 bg-lime-50 px-5 py-3 text-lg font-semibold tracking-tight text-zinc-900 hover:opacity-75 hover:shadow-sm"
          >
            <BsGithub className="mr-3" />
            Github
          </button>
        </div>
      </div>
    </main>
  )
}

export default LandingPage
