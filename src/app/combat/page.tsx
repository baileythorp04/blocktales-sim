"use client";
import { type } from "os";
import { cloneDeep } from 'lodash';
import { useState, useEffect } from "react";
import { Game, Player } from "@/static/gameClasses";
import { Enemy, trotter, dummy } from "@/static/Enemy"
import { Action } from "@/static/Actions";
import Entity from "@/components/entity";
import Image from "next/image";
import { usePlayerBuild } from "@/context/PlayerBuildContext";
import { Card, CardType } from "@/static/Cards";

let combatStarted = false
let initialGameState : Game;

export default function Combat() {
  const { playerBuild } = usePlayerBuild();
  
  let p = new Player(playerBuild)
  let es = [trotter(), dummy(), dummy(), dummy()]
  const [ game, setGame ]  = useState<Game>(new Game(p, es))
  const [ spError, setSpError ] = useState<boolean>(false)
  const [ hpError, setHpError ] = useState<boolean>(false)
  const [ selectedEnemyId, setSelectedEnemyId ] = useState<number>(game.enemies[0].id)

  useEffect(() => {
    if (combatStarted) return
    combatStarted = true
    initialGameState = cloneDeep(game)
  }, [])

  function handleUndo() {
    if (game.lastTurnState){
      setGame(game.lastTurnState)
    }
  }

  function handleRestart() {
    if (initialGameState){
      let g = initialGameState.clone()
      g.lastTurnState = cloneDeep(game)
      setGame(g)
    }
  }

  function handleEnemyClick(enemy: Enemy) {
    setSelectedEnemyId(enemy.id)
  }

  function handleActionClick(action: Action): void {
    let g = game.clone() //TODO HUH? why does a shallow clone even work here? why is being a different object important here, just for react rendering purposes?
    g.lastTurnState = cloneDeep(game)

    // ### player action ###
    setSpError(false)
    setHpError(false)
   
    let result = g.player.cast(action, g.getEnemyById(selectedEnemyId))
    if (result == "missing sp") {
      setSpError(true)
    } else if (result == "missing hp") {
      setHpError(true)
    } else if (result == "success") {

      /// ((( second-player-turn logic )))

      /// ### enemy action ####
      g.enemies.forEach((enemy) => {
        enemy.doAttack(g.player)
      })

      /// ### start-of-turn effects ####
      g.player.startOfTurnEffects()
      g.enemies.forEach((e) => {e.startOfTurnEffects()})
      

      setGame(g)
    }
  }

  return (
    <div className="container border mx-auto">
      <div className="grid grid-cols-5 border border-red-500">
        <Entity name="player" isPlayer={true} hp={game.player.hp} maxHp={game.player.maxHp} sp={game.player.sp} maxSp={game.player.maxSp}/>
        {game.enemies.map(enemy =>
        <div key={enemy.id} onClick={() => handleEnemyClick(enemy)} className={`cursor-pointer ${enemy.id == selectedEnemyId && "bg-amber-100"}`}>
          <Entity name="enemy" isPlayer={false} hp={enemy.hp} maxHp={enemy.maxHp} attack1={enemy.getAttackName(1)} attack2={enemy.getAttackName(2)}/>
        </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-5 gap-4 items-center w-fit">
        {game.player.actions.map((action) => (
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

      {game.lastTurnState != undefined
          ? <div onClick={() => handleUndo()} className={`mt-8 p-4 border bg-gray-200 border-gray-400 `}>Undo</div>
          : <div className={`mt-8 p-4 border bg-gray-100 text-gray-300 cursor-default`}>Undo</div>
        }
      <div onClick={() => handleRestart()} className={`mt-8 p-4 border bg-gray-200 border-gray-400 `}>Restart</div>

      { spError && <div className="text-3xl">
        Not Enough SP
      </div> }
      { hpError && <div className="text-3xl">
        Not Enough HP
      </div> }
    </div>
      
  );
}
