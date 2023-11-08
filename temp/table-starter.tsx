/**
 * v0 by Vercel.
 * @see https://v0.dev/t/2BUMTKiATTi
 */
import Link from "next/link"

export default function Component() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="flex h-16 shrink-0 items-center border-b px-4 md:px-6">
        <nav className="relative flex gap-6 overflow-hidden text-lg font-medium md:flex-row md:items-center md:gap-5 lg:gap-6">
          <span className="absolute inset-x-0 bottom-0 h-2 scale-x-0 transform rounded-full bg-gray-200 transition-transform duration-200 ease-out group-hover:scale-x-100" />
          <Link
            className="group relative rounded-md px-2 py-1 font-bold"
            href="#"
          >
            <span>Budget</span>
          </Link>
          <Link
            className="group relative rounded-md px-2 py-1 text-zinc-500 dark:text-zinc-400"
            href="#"
          >
            <span>Balance</span>
          </Link>
          <Link
            className="group relative rounded-md px-2 py-1 text-zinc-500 dark:text-zinc-400"
            href="#"
          >
            <span>Journal</span>
          </Link>
        </nav>
      </header>
      <main className="p-4">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2">Category/Month</th>
              <th className="px-4 py-2">January</th>
              <th className="px-4 py-2">February</th>
              <th className="px-4 py-2">March</th>
              <th className="px-4 py-2">April</th>
              <th className="px-4 py-2">May</th>
              <th className="px-4 py-2">June</th>
              <th className="px-4 py-2">July</th>
              <th className="px-4 py-2">August</th>
              <th className="px-4 py-2">September</th>
              <th className="px-4 py-2">October</th>
              <th className="px-4 py-2">November</th>
              <th className="px-4 py-2">December</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-300">
            <tr>
              <td className="border px-4 py-2">Rent</td>
              <td className="border px-4 py-2">$1000</td>
              <td className="border px-4 py-2">$1000</td>
              <td className="border px-4 py-2">$1000</td>
              <td className="border px-4 py-2">$1000</td>
              <td className="border px-4 py-2">$1000</td>
              <td className="border px-4 py-2">$1000</td>
              <td className="border px-4 py-2">$1000</td>
              <td className="border px-4 py-2">$1000</td>
              <td className="border px-4 py-2">$1000</td>
              <td className="border px-4 py-2">$1000</td>
              <td className="border px-4 py-2">$1000</td>
              <td className="border px-4 py-2">$1000</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  )
}
