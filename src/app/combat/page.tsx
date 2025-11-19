"use client";

import { type } from "os";
import { useState, useEffect } from "react";
import { Game, Player, Enemy, trotter } from "@/static/gameClasses";
import { Action } from "@/static/Actions";
import Entity from "@/components/entity";
import Image from "next/image";
import { usePlayerBuild } from "@/context/PlayerBuildContext";
import { Card, CardType } from "@/static/Cards";

//IMMEDIATE TODO:
//can select enemy
//convert and add selected cards to action list

export default function Combat() {
  const { playerBuild } = usePlayerBuild();
  const [ combatStarted, setCombatStarted ] = useState<boolean>(false) //This is just to prevent start of combat useEffect happening twice in devenv (doesnt actually work)
  
  let p = new Player(playerBuild)
  let es = [trotter(), new Enemy(9), new Enemy(10), new Enemy(11)]
  const [ game, setGame ]  = useState<Game>(new Game(p, es))
  const [ spError, setSpError ] = useState<boolean>(false)
  const [ hpError, setHpError ] = useState<boolean>(false)
  const [ selectedEnemy, setSelectedEnemy ] = useState<Enemy>(game.enemies[0])

  //TODO: turn this into a 'start game' button
  useEffect(() => {
    if (!combatStarted){
      let g = game.clone()

      g.startCombat()
      
      setGame(g)
      setCombatStarted(true)
    }

  }, [])

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
      g.player.cards.forEach((card: Card) => {
      if (card.type == CardType.START_OF_TURN){
        card.doEffect(g.player)
      }
    })

      setGame(g)
    }
  }

  return (
    <div className="container border mx-auto">
      <div className="grid grid-cols-5 border border-red-500">
        <Entity name="player" isPlayer={true} hp={game.player.hp} maxHp={game.player.maxHp} sp={game.player.sp} maxSp={game.player.maxSp}/>
        {game.enemies.map(enemy =>
        <div key={enemy.id} onClick={() => handleEnemyClick(enemy)} className={`cursor-pointer ${enemy == selectedEnemy && "bg-amber-100"}`}>
          <Entity name="enemy" isPlayer={false} hp={enemy.hp}/>
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
