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


export default function Combat() {
  const { playerBuild } = usePlayerBuild();
  
  const [ game, setGame ] = useState<Game>(() => {
    const es = [trotter(), dummy(), dummy(), dummy()]
    const player = new Player(playerBuild)
    return new Game(player, es)
  })
  const [ spError, setSpError ] = useState<boolean>(false)
  const [ hpError, setHpError ] = useState<boolean>(false)
  const [ selectedEnemy, setSelectedEnemy ] = useState<Enemy>(() => game.enemies[0]) //TODO change this to ID for undo/restart (and change enemy list generation to always use the same IDs)

  function handleEnemyClick(enemy: Enemy) {
    setSelectedEnemy(enemy)
  }

  function handleActionClick(action: Action): void {
    let g = game.clone()

    // ### player action ###
    setSpError(false)
    setHpError(false)
    let result = g.player.doAction(action, selectedEnemy)
    if (result == "missing sp") {
      setSpError(true)
    } else if (result == "missing hp") {
      setHpError(true)
    } else if (result == "success") {
    g.player.endOfActionEffects() //is actually only the player's action
    g.enemies.forEach(e => e.endOfActionEffects())
    

      /// ((( second-player-turn logic )))

      /// ### enemy action ####
      g.enemies.forEach((enemy) => {
        enemy.doNextAction(g.player, g.enemies)
      })



      /// ### start-of-turn effects ####
      g.player.startOfTurnEffects()
      g.enemies.forEach((e) => {e.startOfTurnEffects()})

      // ### entity isDead check ###
      if (g.player.isDead) {
        g.gameOver = true
      }
      g.enemies = g.enemies.filter(e => e.isDead == false) //TODO fix selected enemy staying on the dead, removed enemy
      
      setGame(g)
    }
  }

  return (
    <div className="container border mx-auto">
      <div className="grid grid-cols-5 border border-red-500">
        <CombatPlayer hp={game.player.hp} maxHp={game.player.maxHp} sp={game.player.sp} maxSp={game.player.maxSp} statusHolder={game.player.statuses}/>
        {game.enemies.map(enemy =>
        <div key={enemy.id} onClick={() => handleEnemyClick(enemy)} className={`cursor-pointer ${enemy == selectedEnemy && "bg-amber-100"}`}>
          <CombatEnemy name={enemy.name} hp={enemy.hp} maxHp={enemy.maxHp} attack1={enemy.getActionName(0)} attack2={enemy.getActionName(1)} statusHolder={enemy.statuses} stance={enemy.stanceImmunity}/>
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
