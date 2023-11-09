"use client"

import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useSelectedLayoutSegments } from "next/navigation"
import { useState, type FC } from "react"
import { cn } from "~/lib/utils"
import { RxHamburgerMenu } from "react-icons/rx"
import { AiOutlineClose } from "react-icons/ai" // import the AiOutlineClose icon from react-icons/ai

interface HeaderProps {
  user: SessionUser
  className?: string
}

const Header: FC<HeaderProps> = ({ user, className }) => {
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const segement = useSelectedLayoutSegments()

  return (
    <>
      <header
        className={cn(
          "flex h-12 items-center justify-between border-b px-4 mobile:px-6",
          className,
        )}
      >
        <div>
          <Image src={"/images/logo.png"} alt="Logo" width={32} height={32} />
        </div>
        <div
          className="mr-auto cursor-pointer pl-6 mobile:hidden"
          aria-label="Toggle Sidebar"
        >
          <RxHamburgerMenu
            className="h-6 w-6 text-zinc-500 hover:text-zinc-900"
            onClick={() => setShowSidebar(!showSidebar)}
          />
        </div>
        <div
          className={cn(
            "z-10 bg-transparent mobile:hidden",
            showSidebar ? "fixed inset-0" : "hidden",
          )}
          onClick={() => setShowSidebar(false)}
        />
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "fixed left-0 top-0 z-50 h-full w-[350px] border bg-white shadow-xl transition-all duration-300 ease-in-out mobile:hidden",
            showSidebar ? "translate-x-0" : "-translate-x-full shadow-none",
          )}
        >
          <nav
            aria-label="Sidebar Mobile Navigation"
            className="flex flex-col justify-between space-y-2 py-2"
          >
            <div className="flex justify-end pr-4">
              <AiOutlineClose
                className="h-6 w-6 cursor-pointer text-zinc-500 hover:text-zinc-900"
                onClick={() => setShowSidebar(false)}
              />
            </div>
            <Link
              href="/dashboard/budget"
              onClick={() => setShowSidebar(false)}
              className={cn(
                "group relative",
                segement[1] === "budget"
                  ? "text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-900",
              )}
            >
              <span className="px-6 text-lg">Budget</span>
              <span
                className={cn(
                  "absolute inset-y-0 left-0 w-1 scale-y-0 transform rounded-full bg-lime-600 transition-transform duration-200 ease-out ",
                  segement[1] === "budget" ? "scale-y-100" : "scale-y-0",
                )}
              />
            </Link>
            <Link
              href="/dashboard/balance"
              onClick={() => setShowSidebar(false)}
              className={cn(
                "group relative",
                segement[1] === "balance"
                  ? "text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-900",
              )}
            >
              <span className="px-6 text-lg">Balance</span>
              <span
                className={cn(
                  "absolute inset-y-0 left-0 w-1 scale-y-0 transform rounded-full bg-lime-600 transition-transform duration-200 ease-out ",
                  segement[1] === "balance" ? "scale-y-100" : "scale-y-0",
                )}
              />
            </Link>
            <Link
              href="/dashboard/journal"
              onClick={() => setShowSidebar(false)}
              className={cn(
                "group relative",
                segement[1] === "journal"
                  ? "text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-900",
              )}
            >
              <span className="px-6 text-lg">Journal</span>
              <span
                className={cn(
                  "absolute inset-y-0 left-0 w-1 scale-y-0 transform rounded-full bg-lime-600 transition-transform duration-200 ease-out ",
                  segement[1] === "journal" ? "scale-y-100" : "scale-y-0",
                )}
              />
            </Link>
          </nav>
        </div>
        <div className="mr-auto hidden pl-6 mobile:block">
          <nav
            className="flex gap-6 lg:gap-6 mobile:flex-row mobile:items-center mobile:gap-5"
            aria-label="Desktop Navbar"
          >
            <Link
              href="/dashboard/budget"
              className={cn(
                "group relative",
                segement[1] === "budget"
                  ? "text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-900",
              )}
            >
              <span>Budget</span>
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-0.5 scale-x-0 transform rounded-full bg-lime-600 transition-transform duration-200 ease-out ",
                  segement[1] === "budget" ? "scale-x-100" : "scale-x-0",
                )}
              />
            </Link>
            <Link
              href="/dashboard/balance"
              className={cn(
                "group relative",
                segement[1] === "balance"
                  ? "text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-900",
              )}
            >
              <span>Balance</span>
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-0.5 scale-x-0 transform rounded-full bg-lime-600 transition-transform duration-200 ease-out",
                  segement[1] === "balance" ? "scale-x-100" : "scale-x-0",
                )}
              />
            </Link>
            <Link
              href="/dashboard/journal"
              className={cn(
                "group relative",
                segement[1] === "journal"
                  ? "text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-900",
              )}
            >
              <span>Journal</span>
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-0.5 scale-x-0 transform rounded-full bg-lime-600 transition-transform duration-200 ease-out ",
                  segement[1] === "journal" ? "scale-x-100" : "scale-x-0",
                )}
              />
            </Link>
          </nav>
        </div>
        <div className="flex items-center">
          <div className="mr-6">{user.name}</div>
          <button
            onClick={() => setShowUserDialog(true)}
            className="h-[32px] w-[32px] overflow-hidden rounded-full hover:opacity-70"
          >
            <Image
              src={user.image ?? "/images/avatar.jpg"}
              alt="Avatar"
              width={32}
              height={32}
            />
          </button>
        </div>
      </header>
      {showUserDialog && (
        <>
          <div
            onClick={() => setShowUserDialog(false)}
            className="fixed inset-0 z-40 bg-zinc-900/70 backdrop-blur-sm mobile:bg-transparent mobile:backdrop-blur-none"
          />
          <div
            onClick={() => setShowUserDialog(false)}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          >
            <div
              aria-label="User Dialog"
              onClick={(e) => e.stopPropagation()}
              className="z-50 rounded-lg border bg-white shadow-md mobile:fixed mobile:right-0 mobile:top-0 mobile:mr-4 mobile:mt-14"
            >
              <div className="flex flex-col justify-between space-y-2 py-2">
                <div className="flex flex-col px-6">
                  <h1 className="text-lg font-semibold">{user.name}</h1>
                  <div className="font-light text-zinc-400">{user.email}</div>
                </div>
                <div
                  onClick={() => signOut()}
                  className="flex items-center border-t px-6 py-2 text-zinc-600 hover:cursor-pointer hover:bg-zinc-50 hover:text-zinc-950"
                >
                  <p>Sign Out</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Header
