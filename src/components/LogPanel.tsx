"use client"
import React, { useEffect, useState } from "react"
import useLogger from "@/hooks/useLogger"

export default function LogPanel() {
  const { logs } = useLogger()
  const [mounted, setMounted] = useState(false)
  const [reverse, setReverse] = useState(false)

  useEffect(() => { //hydration error suppression from ChatGPT
    setMounted(true)
  }, [])

  function flip() {
    setReverse(!reverse)
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col h-100 w-120 bg-white border p-2 text-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold">Log</div>
        <button onClick={flip} className="text-xs px-2 py-1 border">Reverse</button>
      </div>
      <div className={`flex overflow-y-scroll h-full ${reverse ? "flex-col-reverse" : "flex-col"} `}>
        {logs.map((logColumn, colIdx) => (
          <div key={colIdx} className={`w-100 flex ${reverse ? "flex-col-reverse" : "flex-col"} border-dashed py-4 border-t ${colIdx < logs.length-1 && "text-gray-500"}`}>
            <div>Turn {colIdx+1}</div>
            {logColumn.map(l => (
              <div key={l.id} className="text-xs mb-1">
                <span className="text-gray-400 mr-2">{l.id}</span>
                <span>{l.msg}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}