"use client";
import GridCell from "@/components/GridCell";
import { useStats, Stat } from "@/hooks/useStats";
import { useState } from "react";
import Link from "next/link";

const MAX_BUX = 24

export default function Menu() {
  const { hp, sp, bp, remainingLevels, MAX_LEVEL, changeStat } = useStats();
  const [remainingBux, setReamainingBux] = useState(MAX_BUX);

  return (
    <div className="grid grid-cols-3 justify-center items-center mx-8">
      <div className="flex flex-col items-center justify-center">

        <h1 className="text-2xl font-bold mb-4">Choose Cards</h1>
        <div className="overflow-auto h-100 w-full flex flex-col items-center p-2 border border-gray-300">

          {[1,2,3,4,5].map((_) => (
          <div key={_} className="w-full grid grid-cols-2 border-b p-2">
            <div className="flex flex-row gap-2">
              <div>icon</div>
              <div>card-name</div>
            </div>
            <div className="flex flex-row-reverse gap-2">
              <div>bux</div>
              <div>bp</div>
            </div>
          </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-4">Menu</h1>
        <p className="text-lg mb-6">This is the menu page.</p>
        <div className="text-xl font-mono">Remaining Levels: {remainingLevels}/{MAX_LEVEL}</div>

        <div
          className="grid w-full max-w-md"
          style={{
            gridTemplateRows: "1fr 2fr 1fr",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
            height: "300px",
            width: "300px",
          }}
        >
          <GridCell onClick={() => changeStat(Stat.HP, false)}>HP+</GridCell>
          <GridCell onClick={() => changeStat(Stat.SP, false)}>SP+</GridCell>
          <GridCell onClick={() => changeStat(Stat.BP, false)}>BP+</GridCell>
          <GridCell>HP: {hp}</GridCell>
          <GridCell>SP: {sp}</GridCell>
          <GridCell>BP: {bp}</GridCell>
          <GridCell onClick={() => changeStat(Stat.HP, true)}>HP-</GridCell>
          <GridCell onClick={() => changeStat(Stat.SP, true)}>SP-</GridCell>
          <GridCell onClick={() => changeStat(Stat.BP, true)}>BP-</GridCell>
        </div>
        <Link href="/combat" className="mt-8 text-blue-500 underline">Go to Combat</Link>
      </div>
      <div className="border border-gray-300">
        choose items
      </div>
    </div>
  );
}


// Ask the AI to put a scrollable list of cards to the left. put remaining bux above it.