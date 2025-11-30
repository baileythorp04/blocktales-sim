"use client";

import { type } from "os";
import { useState, useEffect } from "react";
import { Game, Player } from "@/static/gameClasses";
import { Enemy, trotter, dummy } from "@/static/Enemy"
import { Action } from "@/static/Actions";
import Image from "next/image";
import { usePlayerBuild } from "@/context/PlayerBuildContext";
import { Card, CardType } from "@/static/Cards";
import CombatPlayer from "@/components/CombatPlayer";
import CombatEnemy from "@/components/CombatEnemy";
import { StatusType } from "@/static/StatusHolder";
import { cloneDeep } from "lodash"

let gameInstanceStack : Game[] = [] //includes all previous game states, not the current one
let hasAnotherAction = true

export default function Combat() {
  const { playerBuild } = usePlayerBuild();
  
  const [ game, setGame ] = useState<Game>(() => {
    const es = [trotter(), dummy(), dummy(), dummy()]
    const player = new Player(playerBuild)
    return new Game(player, es)
  })
  const [ spError, setSpError ] = useState<boolean>(false)
  const [ hpError, setHpError ] = useState<boolean>(false)
  const [ selectedEnemyPosition, setSelectedEnemyPosition ] = useState<number>(0) 
  function handleEnemyClick(i: number) {
    setSelectedEnemyPosition(i)
  }

  function handleActionClick(action: Action): void {
    let g = cloneDeep(game)


    // ### player action ###
    setSpError(false)
    setHpError(false)
    let enemy = g.getEnemyByPosition(selectedEnemyPosition)
    let result = g.player.doAction(action, enemy, g.enemies)
    if (result == "missing sp") {
      setSpError(true)
    } else if (result == "missing hp") {
      setHpError(true)
    } else if (result == "success") {
      g.player.endOfActionEffects() //leech heal
      g.enemies.forEach(e => e.endOfActionEffects()) //change stance

      /// ((( second-player-turn logic )))
      if (g.player.hasStatus(StatusType.DEFENDING)) { hasAnotherAction = false }
      if (!hasAnotherAction){
        
        /// ### enemy action ####
        g.enemies.forEach((enemy) => {
          enemy.doNextAction(g.player, g.enemies)
          if (enemy.haste == true){
            enemy.doNextAction(g.player, g.enemies)
          }
        })


        /// ### start-of-turn effects ####
        g.player.startOfTurnEffects()
        g.enemies.forEach((e) => {e.startOfTurnEffects()})
      }
      hasAnotherAction = !hasAnotherAction
        


      // ### entity isDead check ###
      if (g.player.isDead) {
        g.gameOver = true
      }
      g.enemies = g.enemies.filter(e => e.isDead == false)
      
      gameInstanceStack.push(game)
      setGame(g)
    }
  }

  function handleUndo() {
    let prevState = gameInstanceStack.pop()
    if (prevState == undefined){
      console.error("no previous game state to undo to")
    } else {
      setGame(prevState)
    }
  }

  function handleRestart() {
    let initState = gameInstanceStack[0]
    if (initState == undefined){
      console.error("no previous game state to restart to")
    } else {
      setGame(initState)
    }
  }

  return (
    <div className="container border mx-auto">
      <div className="grid grid-cols-5 border border-red-500">
        <CombatPlayer hp={game.player.hp} maxHp={game.player.maxHp} sp={game.player.sp} maxSp={game.player.maxSp} statusHolder={game.player.statuses}/>
        {game.enemies.map((enemy, i) =>
        <div key={i} onClick={() => handleEnemyClick(i)} className={`cursor-pointer ${i == selectedEnemyPosition && "bg-amber-100"}`}>
          <CombatEnemy name={enemy.name} hp={enemy.hp} maxHp={enemy.maxHp} attack1={enemy.getActionName(0)} attack2={enemy.getActionName(1)} statusHolder={enemy.statuses} stance={enemy.stanceImmunity} haste={enemy.haste}/>
        </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-5 gap-4 items-center w-fit">
        {game.player.getActions(hasAnotherAction).map((action) => (
          <div key={action.id} className={`w-full cursor-pointer`} onClick={() => handleActionClick(action)}>
            <div className="grid grid-rows-4">
              <Image
                className="row-span-3"
                src={"/cards/" + action.icon}
                alt={action.name + " icon"}
                width={80}
                height={80}
                />
              {action.spCost > 0 && <div className="row-span-1 flex justify-center">{action.spCost} SP</div>}
              {action.hpCost > 0 && <div className="row-span-1 flex justify-center">{action.hpCost} HP</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="p-1 mt-3 border-b-2 w-115">Passive Cards</div>

      <div className="mt-6 grid grid-cols-5 gap-4 items-center w-fit">
        {game.player.cards.filter(card => card.type != CardType.ACTIVE).map((card) => (
          <div key={card.id} className={`w-full`}>
            <Image
              className={`row-span-3 ${!card.enabled && "grayscale"}`}
              src={"/cards/" + card.icon}
              alt={card.name + " icon"}
              width={80}
              height={80}
              />
          </div>
        ))}
      </div>
      {gameInstanceStack.length > 0
      ? <div className="flex justify-around my-8 w-115">
          <div onClick={() => handleUndo()} className={`w-30 p-4 flex justify-center  border bg-gray-200 border-gray-400 cursor-pointer`}>Undo</div>
          <div onClick={() => handleRestart()} className={`w-30 p-4 flex justify-center  border bg-gray-200 border-gray-400 cursor-pointer`}>Restart</div>
        </div>
      : <div className="flex justify-around my-8 w-115">
          <div className={`w-30 p-4 flex justify-center border bg-gray-100 text-gray-300 cursor-default`}>Undo</div>
          <div className={`w-30 p-4 flex justify-center border bg-gray-100 text-gray-300 cursor-default`}>Restart</div>
        </div>}

      { spError && <div className="text-3xl">
        Not Enough SP
      </div> }
      { hpError && <div className="text-3xl">
        Not Enough HP
      </div> }
      { game.gameOver && <div className="text-3xl">
        GAME OVER
      </div> }
    </div>
      
  );
}
