"use client"

import { createContext, useContext, useState } from "react"

const LogContext = createContext(
  {} as {
    log: ILog
    addLog: (logItem: string) => void
    clearLog: () => void
  },
)

export const useLogContext = () => useContext(LogContext)

export const LogProvider = ({ children }: { children: React.ReactNode }) => {
  const [log, setLog] = useState({} as ILog)

  const addLog = (logItem: string) => {
    const timestamp = new Date().getTime()
    setLog((prevLog) => ({ ...prevLog, [timestamp]: logItem }))
  }

  const clearLog = () => {
    setLog({})
  }

  return (
    <LogContext.Provider value={{ log, addLog, clearLog }}>
      {children}
    </LogContext.Provider>
  )
}
