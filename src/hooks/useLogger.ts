import { useEffect, useState } from "react"
import { logger, LogEntry } from "@/static/logger"

export default function useLogger() {
  const [logs, setLogs] = useState<LogEntry[][]>(() => logger.get())

  useEffect(() => {
    const unsub = logger.subscribe(setLogs)
    return () => {
      unsub()
    }
  }, [])

  return {
    logs,
    log: (msg: string) => logger.log(msg),
  }
}