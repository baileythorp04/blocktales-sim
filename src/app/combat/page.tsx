"use client";

import { type } from "os";
import { useState, useEffect } from "react";
import { Game, Player, Enemy } from "@/static/gameClasses";
import { Action, DEFAULT_ACTIONS } from "@/static/Actions";
import Entity from "@/components/entity";
import Image from "next/image";
import { useCardSelection } from "@/context/CardSelectionContext";

//IMMEDIATE TODO:
//can select enemy
//convert and add selected cards to action list

export default function Combat() {
  const { selectedCards, setSelectedCards } = useCardSelection();
  
  //const { game, doPlayerTurn } = useGame()
  let p = new Player(10, 5)
  let es = [new Enemy(8), new Enemy(9)]
  const [ game, setGame ]  = useState<Game>(new Game(p, es))
  const [ spError, setSpError ] = useState<boolean>(false)

  function handleActionClick(action: Action): void {
    //inputs: target, dmg, status, etc. default set to none.
      
    let ng = game.clone()

    let result = ng.player.cast(action, ng.enemies[0])
    if (result == "missing sp") {
      setSpError(true)
    } else if (result == "success") {
      setSpError(false)
      setGame(ng)
    }

  }

  return (
    <div className="container border mx-auto">
      <div className="grid grid-cols-5 border border-red-500">
        <Entity name="player" isPlayer={true} hp={game.player.hp} maxHp={game.player.maxHp} sp={game.player.sp} maxSp={game.player.maxSp}/>
        {game.enemies.map(enemy =>
          <Entity key={enemy.id} name="enemy" isPlayer={false} hp={enemy.hp} />
        )}
      </div>

      <div className="mt-6 grid grid-cols-5 gap-4 items-center w-fit">
        {DEFAULT_ACTIONS.map((action) => (
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
            </div>
          </div>
        ))}
      </div>

      { spError && <div className="text-3xl">
        Not Enough SP
      </div> }
    </div>
      
  );
}
