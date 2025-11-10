"use client";

import { type } from "os";
import { useState, useEffect } from "react";
import { Game, Player, Enemy } from "@/static/gameClasses";
import { DEFAULT_CARDS } from "@/static/Cards";
import Entity from "@/components/entity";
import Image from "next/image";
import { useCardSelection } from "@/context/CardSelectionContext";

export default function Combat() {
  const { selectedCards, setSelectedCards } = useCardSelection();
  
  useEffect(() => {setSelectedCards(selectedCards.concat(DEFAULT_CARDS))}, [])

  //const { game, doPlayerTurn } = useGame()
  let p = new Player(10, 5)
  let es = [new Enemy(8), new Enemy(9)]
  const [ game, setGame ]  = useState<Game>(new Game(p, es))

  function action(): void {
    //inputs: target, dmg, status, etc. default set to none.
      
    let ng = game.clone()

    ng.player.sword(game.enemies[0]) 

    setGame(ng)
  }

  return (
    <div className="container border mx-auto">
      <div className="grid grid-cols-5 border border-red-500">
        <Entity name="player" isPlayer={true} hp={game.player.hp} sp={game.player.sp} />
        {game.enemies.map(enemy =>
          <Entity key={enemy.id} name="enemy1" isPlayer={false} hp={enemy.hp} />
        )}
      </div>

      <div className="flex flex-col items-center justify-center p-8">
          <div className="cursor-pointer text-3xl" onClick={() => action()}>Attack</div>
      </div>

      <div className="grid grid-cols-5 gap-4 items-center w-fit">

        {selectedCards.map((card) => (
          <div key={card.id} className={`w-full cursor-pointer`}>
            <div className="">
              <Image
                src={"/cards/" + card.icon}
                alt={card.name + " icon"}
                width={80}
                height={80}
                />
            </div>
          </div>
        ))}
      </div>
    </div>
      
  );
}
