"use client";
import GridCell from "@/components/GridCell";
import { useState } from "react";
import { useStats, Stat } from "@/hooks/useStats";
import { useCards } from "@/hooks/useCards";
import Link from "next/link";
import Image from "next/image";


const MAX_BUX = 24

export default function Menu() {
  const [remainingBux, setReamainingBux] = useState(MAX_BUX);
  const { hp, sp, bp, remainingLevels, MAX_LEVEL, changeStat } = useStats();
  const { cardList } = useCards();

  return (
    <div className="grid grid-cols-3 justify-center items-center mx-8">
      <div className="flex flex-col items-center justify-center">

        <h1 className="text-3xl font-bold mb-4">Cards</h1>
        <div className="overflow-auto h-100 w-full flex flex-col items-center p-2 border border-gray-300 text-xl">

          {cardList.map((card) => (
          <div key={card.id} className="w-full grid grid-cols-2 border-b p-2">
            <div className="flex flex-row gap-2 items-center">
              <Image
                src={"/cards/" + card.icon}
                alt={card.name + " icon"}
                width={50}
                height={50}
              />
              <div>{card.name}</div>
            </div>
            <div className="flex flex-row-reverse gap-2 items-center">
              <Image
                src="/bp.png"
                alt="bp"
                width={40}
                height={40}
              />
              <div>{card.bp}</div>
              {card.bux > 0 && <Image
                src="/bux.png"
                alt="bux"
                width={40}
                height={40}
              />}
              {card.bux > 0 && <div>{card.bux}</div> }
            </div>
          </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-4">Stats</h1>
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
          <GridCell>
            <Image
                src="/hp.png"
                alt="hp"
                width={50}
                height={50}
              />
            <div className="ml-2 text-2xl">{hp}</div>
          </GridCell>
          <GridCell>
            <Image
                src="/sp.png"
                alt="sp"
                width={50}
                height={50}
              />
            <div className="ml-1 text-2xl">{sp}</div>
          </GridCell>
          <GridCell>
            <Image
                src="/bp.png"
                alt="bp"
                width={50}
                height={50}
              />
            <div className="ml-2 text-2xl">{bp}</div>
          </GridCell>
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