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
      <div className="mobile-hz:space-y-6 mobile-hz:flex-col mobile-hz:justify-center flex h-full items-center justify-evenly space-y-2">
        <div className="mobile-hz:space-y-6 flex flex-col items-center justify-center space-y-2">
          <Image src={"/images/logo.png"} width={100} height={100} alt="Logo" />
          <div className="text-center tracking-tight">
            <h1 className="mobile:text-4xl text-2xl font-bold text-zinc-900">
              Welcome to Dbudget!
            </h1>
            <p className="mobile:text-xl text-lg text-zinc-900">
              The budgeting app for the rest of us.
            </p>
          </div>
        </div>

        <div className="mobile-hz:flex my-6 hidden w-full items-center justify-center">
          <hr className="border-1 w-[70px] border-gray-300 sm:w-[100px]" />
          <span className="mx-3 font-medium text-gray-500">Continue with</span>
          <hr className="border-1 w-[70px] border-gray-300 sm:w-[100px]" />
        </div>

        <div className="flex w-[200px] flex-col space-y-2 sm:w-[300px]">
          <div className="mobile-hz:hidden my-2 flex w-full items-center justify-center">
            <hr className="border-1 w-[50px] border-gray-300" />
            <span className="mx-3 font-medium text-gray-500">
              Continue with
            </span>
            <hr className="border-1 w-[50px] border-gray-300" />
          </div>
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
