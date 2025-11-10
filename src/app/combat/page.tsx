"use client";

import { type } from "os";
import { useState } from "react";
import { Game, Player, Enemy } from "@/static/gameClasses";
import Entity from "@/components/entity";
import Image from "next/image";
import { useCardSelection } from "@/context/CardSelectionContext";

export default function Combat() {
  const { selectedCards, setSelectedCards } = useCardSelection();
  

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

        {/* map each active turn card to a button. each card does it effect using the game/player */}


      </div>
      <div className="flex flex-col items-center justify-center p-8">
          <div className="cursor-pointer text-3xl" onClick={() => action()}>Attack</div>
      </div>
      {selectedCards.map((card) => (
        <div key={card.id} className={`w-full grid grid-cols-2 border-b p-2 cursor-pointer`}>
          <div className="flex flex-row gap-2 items-center">
            <Image
              src={"/cards/" + card.icon}
              alt={card.name + " icon"}
              width={50}
              height={50}
            />
            <div>{card.name}</div>
          </div>
        </div>
        ))}
    </div>
      
  );
}
