"use client";
import GridCell from "@/components/GridCell";
import ItemBox from "@/components/ItemBox"
import { useState, useEffect } from "react";
import { useStats, Stat } from "@/hooks/useStats";
import { BUYABLE_CARDS, Card } from "@/static/Cards";
import { usePlayerBuild } from "@/context/PlayerBuildContext"
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BUYABLE_ITEMS, Item } from "@/static/Items";
import { logger } from "@/static/logger";


const MAX_BUX = 17
let menuFinished = false

export default function Menu() {
  const router = useRouter();
  const [usedBux, setUsedBux] = useState(0);
  const [usedBp, setUsedBp] = useState(0);
  const { hp, sp, bp, remainingLevels, MAX_LEVEL, changeStat } = useStats();
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [selectedItemList, setSelectedItemList] = useState<Item[]>([]);
  const { playerBuild, setPlayerBuild } = usePlayerBuild();

  function toggleSelectCard(card: Card) {
    if (selectedCards.some(c => c === card)) {
      setSelectedCards(selectedCards.filter(c => c != card));
    } else {
      setSelectedCards(selectedCards.concat(card))
    }
    
  }

  function handleAddItem(item: Item) {
    if (selectedItemList.length < 10) {
      setSelectedItemList(selectedItemList.concat(item))
    }
  }

  function handleRemoveItem(item: Item, index: number) {
    setSelectedItemList(selectedItemList.filter((item, i) => i != index))
  }

  useEffect(() => setRemainingStats(), [selectedCards])

  function setRemainingStats() {
    let bpTotal = 0
    let buxTotal = 0
    selectedCards.forEach(card => {
      bpTotal += card.bp
      buxTotal += card.bux
    });
    setUsedBux(buxTotal)
    setUsedBp(bpTotal)
  }

  function handleCombatLink() {
    setPlayerBuild({
      hp:hp,
      sp:sp,
      selectedCards:selectedCards,
      selectedItems:selectedItemList,
    })
    menuFinished = true
    router.push("/combat");
  }

  return (
    <div className="grid grid-cols-3 justify-center items-center mx-8">
      <div className="flex flex-col items-center justify-center">

        <h1 className="text-3xl font-bold mb-4">Cards</h1>
        <div className="overflow-auto h-100 w-[80%] flex flex-col items-center p-2 border border-gray-300 text-xl">

          {BUYABLE_CARDS.map((card, i) => (
            <div key={i} onClick={() => {toggleSelectCard(card)}} className={`w-full grid grid-cols-2 border-b p-2 cursor-pointer ${selectedCards.includes(card) && "bg-amber-100"}`}>
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
        <div className="flex flex-row-reverse p-2 gap-2 w-[80%]">
          <div className="flex flex-row-reverse gap-2 items-center text-2xl">
              <Image
                src="/bp.png"
                alt="bp"
                width={40}
                height={40}
              />
              <div className={usedBp > bp ? "text-red-600" : ""}>{usedBp}/{bp}</div>
              <Image
                src="/bux.png"
                alt="bux"
                width={40}
                height={40}
              />
              <div className={usedBux > MAX_BUX ? "text-red-600" : ""}>{usedBux}/{MAX_BUX}</div>
            </div>
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
        {usedBux <= MAX_BUX && usedBp <= bp 
          ? <div onClick={() => handleCombatLink()} className={`mt-8 p-4 border bg-gray-200 border-gray-400 cursor-pointer`}>Go to Combat</div>
          : <div className={`mt-8 p-4 border bg-gray-100 text-gray-300 cursor-default`}>Go to Combat</div>
        }
      </div>





      <div className="flex flex-col items-center justify-center">

        <h1 className="text-3xl font-bold mb-4">Items</h1>
        <div className="overflow-auto h-100 w-[80%] flex flex-col items-center p-2 border border-gray-300 text-xl">

          {BUYABLE_ITEMS.map((item, i) => (
            <div key={i} onClick={() => handleAddItem(item)} className={`w-full grid grid-cols-2 border-b p-2 cursor-pointer`}>
              <div className="flex flex-row gap-2 items-center">
                <Image
                  src={"/items/" + item.icon}
                  alt={item.name + " icon"}
                  width={50}
                  height={50}
                />
                <div>{item.name}</div>
              </div>
              
            </div>
          ))}
        </div>
        <div className="mt-4">
          <ItemBox itemList={selectedItemList} onItemClick={handleRemoveItem}/>
        </div>
      </div>
    </div>
  );
}


// Ask the AI to put a scrollable list of cards to the left. put remaining bux above it.