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
  
  //TODO this creates a new player, enemies, and game on every render. How to fix it? moving player/enemy creation to game constructor doesn't help 
  let p = new Player(playerBuild)
  let es = [trotter(), dummy(), dummy(), dummy()]
  const [ game, setGame ]  = useState<Game>(new Game(p, es))
  const [ spError, setSpError ] = useState<boolean>(false)
  const [ hpError, setHpError ] = useState<boolean>(false)
  const [ selectedEnemy, setSelectedEnemy ] = useState<Enemy>(game.enemies[0])

  function handleEnemyClick(enemy: Enemy) {
    setSelectedEnemy(enemy)
  }

  function handleActionClick(action: Action): void {
    let g = game.clone()

    // ### player action ###
    setSpError(false)
    setHpError(false)
    let result = g.player.cast(action, selectedEnemy)
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
        <CombatPlayer name="player" hp={game.player.hp} maxHp={game.player.maxHp} sp={game.player.sp} maxSp={game.player.maxSp} statusHolder={game.player.statuses}/>
        {game.enemies.map(enemy =>
        <div key={enemy.id} onClick={() => handleEnemyClick(enemy)} className={`cursor-pointer ${enemy == selectedEnemy && "bg-amber-100"}`}>
          <CombatEnemy name="enemy" hp={enemy.hp} maxHp={enemy.maxHp} attack1={enemy.getAttackName(1)} attack2={enemy.getAttackName(2)} statusHolder={enemy.statuses}/>
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
    </div>
      
  );
}
