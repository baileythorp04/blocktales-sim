"use client";

import { type } from "os";
import { useState, useEffect } from "react";
import { Game, Player, Enemy } from "@/static/gameClasses";
import { Action, DEFAULT_ACTIONS } from "@/static/Actions";
import Entity from "@/components/entity";
import Image from "next/image";
import { useCardSelection } from "@/context/CardSelectionContext";
import { Card, CardType } from "@/static/Cards";

//IMMEDIATE TODO:
//can select enemy
//convert and add selected cards to action list

export default function Combat() {
  const { selectedCards } = useCardSelection();
  const [ combatStarted, setCombatStarted ] = useState<boolean>(false) //This is just to prevent start of combat useEffect happening twice in devenv
  
  let p = new Player(25, 10)
  let es = [new Enemy(8), new Enemy(9)]
  const [ game, setGame ]  = useState<Game>(new Game(p, es))
  const [ spError, setSpError ] = useState<boolean>(false)

  //TODO: turn this into a 'start game' button
  useEffect(() => {
    if (!combatStarted){
      let g = game.clone()

      // ### adding player actions ###
      g.player.actions = DEFAULT_ACTIONS
      selectedCards.forEach((card: Card) => {
        if (card.type == CardType.ACTIVE){
          card.doEffect(g.player)
        }
      })

      // ### start-of-combat effects ###
      selectedCards.forEach((card: Card) => {
        if (card.type == CardType.START_OF_COMBAT){
          card.doEffect(g.player)
        }
      })
      setGame(g)
      
      setCombatStarted(true)
    }

  }, [])

  function handleActionClick(action: Action): void {
    let g = game.clone()

    // ### player action ###
    let result = g.player.cast(action, g.enemies[0])
    if (result == "missing sp") {
      setSpError(true)
    } else if (result == "success") {
      setSpError(false)

      /// ((( second-player-turn logic )))

      /// ### enemy action ####

      /// ### start-of-turn effects ####
      selectedCards.forEach((card: Card) => {
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
          <Entity key={enemy.id} name="enemy" isPlayer={false} hp={enemy.hp} />
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
