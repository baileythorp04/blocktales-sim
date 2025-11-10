"use client";

import { type } from "os";
import { useState } from "react";
import { Game, Player, Enemy } from "@/classes/gameClasses";
import Entity from "@/components/entity";
import Image from "next/image";

export default function Menu() {

  //const { game, doPlayerTurn } = useGame()
  let p = new Player(10, 5)
  let es = [new Enemy(8), new Enemy(9)]
  const [ game, setGame ]  = useState<Game>(new Game(p, es))

  function action(): void {
    //inputs: target, dmg, status, etc. default set to none.
    // takedamage function
      
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
          <h1 className="text-3xl font-bold mb-4">Combat</h1>
          <h1 className="font-bold mb-4">player hp: {game.player.hp}</h1>
          <h1 className="font-bold mb-4">player sp: {game.player.sp}</h1>
          <h1 className="font-bold mb-4">enemy hp: {game.enemies[0].hp}</h1>
          <div className="cursor-pointer" onClick={() => action()}>Attack</div>
      </div>
    </div>
      
  );
}
