"use client"

import type { NextPage } from "next"
import { signIn } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { BsGoogle, BsGithub } from "react-icons/bs"
import { Icons } from "~/components/icons"

const LandingPage: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isGoogle, setIsGoogle] = useState<boolean>(false)
  const [isGithub, setIsGithub] = useState<boolean>(false)

  return (
    <div className="flex h-full flex-col">
      <main className="w-full flex-grow bg-white">
        <div className="mobile-hz:space-y-6 mobile-hz:flex-col mobile-hz:justify-center flex h-full items-center justify-evenly space-y-2">
          <div className="mobile-hz:space-y-6 flex flex-col items-center justify-center space-y-2">
            <Image
              src={"/images/logo.png"}
              width={100}
              height={100}
              alt="Logo"
              priority
            />
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
            <span className="mx-3 font-medium text-gray-500">
              Continue with
            </span>
            <hr className="border-1 w-[70px] border-gray-300 sm:w-[100px]" />
          </div>
          <div className="flex w-[250px] flex-col space-y-2 sm:w-[300px]">
            <div className="mobile-hz:hidden my-2 flex w-full items-center justify-center">
              <hr className="border-1 w-[50px] border-gray-300" />
              <span className="mx-3 font-medium text-gray-500">
                Continue with
              </span>
              <hr className="border-1 w-[50px] border-gray-300" />
            </div>
            <button
              onClick={() => {
                setIsLoading(true)
                setIsGoogle(true)
                signIn("google", { callbackUrl: "/dashboard" })
              }}
              className="flex w-full items-center justify-center rounded-full border border-lime-500 bg-lime-50 px-5 py-3 text-lg font-semibold tracking-tight text-zinc-900 hover:opacity-75 hover:shadow disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:opacity-60"
              disabled={isLoading}
            >
              {isLoading && isGoogle ? (
                <Icons.spinner className="mr-3 h-4 w-4 animate-spin" />
              ) : (
                <BsGoogle className="mr-3" />
              )}
              Google
            </button>
            <button
              onClick={() => {
                setIsLoading(true)
                setIsGithub(true)
                signIn("github", { callbackUrl: "/dashboard" })
              }}
              className="flex w-full items-center justify-center rounded-full border border-lime-500 bg-lime-50 px-5 py-3 text-lg font-semibold tracking-tight text-zinc-900 hover:opacity-75 hover:shadow disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:opacity-60"
              disabled={isLoading}
            >
              {isLoading && isGithub ? (
                <Icons.spinner className="mr-3 h-4 w-4 animate-spin" />
              ) : (
                <BsGithub className="mr-3" />
              )}
              Github
            </button>
          </div>
        </div>
      </main>
      <footer className="mb-6 flex-shrink">
        <p className="text-muted-foreground px-8 text-center text-sm">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="hover:text-primary underline underline-offset-4"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="hover:text-primary underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </footer>
    </div>
  )
}

export default LandingPage
