"use client"

import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import { useState, type FC } from "react"

interface HeaderProps {
  user: SessionUser
}

const Header: FC<HeaderProps> = ({ user }) => {
  const [showUserDialog, setShowUserDialog] = useState(false)
  const segement = useSelectedLayoutSegment()

  return (
    <>
      <header className="flex h-12 items-center justify-between border-b px-4">
        <div>
          <Image src={"/images/logo.png"} alt="Logo" width={32} height={32} />
        </div>
        <div className="mobile:block mr-auto hidden pl-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard/budget"
              className={`${
                segement === "budget"
                  ? "text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Budget
            </Link>
            <Link
              href="/dashboard/balance"
              className={`${
                segement === "balance"
                  ? "text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Balance
            </Link>
            <Link
              href="/dashboard/journal"
              className={`${
                segement === "journal"
                  ? "text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Journal
            </Link>
          </div>
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
            className="mobile:bg-transparent mobile:backdrop-blur-none fixed inset-0 bg-neutral-900/70 backdrop-blur-sm"
          />
          <div
            onClick={() => setShowUserDialog(false)}
            className="fixed inset-0 flex flex-col items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="mobile:mt-14 mobile:mr-4 mobile:fixed mobile:top-0 mobile:right-0 z-50 rounded-lg border bg-white shadow-md"
            >
              <div className="flex flex-col justify-between space-y-2 py-2">
                <div className="flex flex-col px-6">
                  <h1 className="text-lg font-bold">{user.name}</h1>
                  <div className="text-sm text-neutral-500">{user.email}</div>
                </div>
                <div
                  onClick={() => signOut()}
                  className="flex items-center border-t px-6 py-2 text-neutral-700 hover:cursor-pointer hover:bg-neutral-50 hover:text-neutral-950"
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
