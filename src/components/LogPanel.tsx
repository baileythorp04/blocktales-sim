"use client"
import React from "react"
import useLogger from "@/hooks/useLogger"

export default function LogPanel() {
  const { logs, clear } = useLogger()

  return (
    <div className="w-80 max-h-60 overflow-auto bg-white border p-2 text-sm z-50">
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold">Log</div>
        <button onClick={clear} className="text-xs px-2 py-1 border">Clear</button>
      </div>
      <div className="space-y-1">
        {logs.map(l => (
          <div key={l.id} className="text-xs">
            <span className="text-gray-400 mr-2">{l.id}:</span>
            <span>{l.msg}</span>
          </div>
        ))}
      </div>
    </div>
  )
}