"use client"
import React, { useEffect, useState, useRef } from "react"
import useLogger from "@/hooks/useLogger"
import { logger } from "@/static/logger"

export default function LogPanel() {
  const { logs } = useLogger()
  const [mounted, setMounted] = useState(false)
  const [reverse, setReverse] = useState(true)
  const [highlightTurn, setHighlightTurn] = useState(false)
  const [allowBoringLogs, setAllowBoringLogs,] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => { //hydration error suppression from ChatGPT
    setMounted(true)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      if (reverse){
        scrollRef.current.scrollTop = -scrollRef.current.scrollHeight
      } else {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }
  }, [logs, reverse, allowBoringLogs])

  function flipOrder() {
    setReverse(!reverse)
  }

  function flipHighlight() {
    setHighlightTurn(!highlightTurn)
  }

  function flipBoring() {
    setAllowBoringLogs(!allowBoringLogs)
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col flex-1 h-120 w-full bg-white px-2 pt-2 text-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold">Log</div>
        <div className="flex flex-row gap-2">
          <button onClick={flipBoring} className="text-xs px-2 py-1 border cursor-pointer">{allowBoringLogs ? "Showing Boring Logs" : "Hiding Boring Logs"}</button>
          <button onClick={flipHighlight} className="text-xs px-2 py-1 border cursor-pointer">{highlightTurn ? "Highlighting This Turn" : "Highlighting Last Action"}</button>
          <button onClick={flipOrder} className="text-xs px-2 py-1 border cursor-pointer">Reverse</button>
        </div>
      </div>
      <div ref={scrollRef} className={`select-text flex overflow-y-scroll ${reverse ? "flex-col-reverse" : "flex-col"} `}>
        {logger.get(allowBoringLogs).map((logColumn, colIdx) => (
          <div key={colIdx} className={`select-text w-full flex ${reverse ? "flex-col-reverse" : "flex-col"} ${((colIdx < logs.length-1 && highlightTurn) || ( logColumn.every(l => !l.new)) && !highlightTurn) && "text-gray-400"}`}>
            <div className={`select-text text-lg border-dashed ${reverse ? "border-b mb-2 pb-2" : "border-t mt-2 pt-2 mb-1"} `}>Turn {colIdx+1}</div>
            {logColumn.map(l => (
              <div key={l.id} className="text-xs mb-1">
                <span className="select-text text-gray-300 mr-2">{l.id}</span>
                <span className={`select-text ${!l.new && !highlightTurn && "text-gray-400" }`}>{l.msg}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}