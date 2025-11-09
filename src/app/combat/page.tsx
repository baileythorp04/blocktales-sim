"use client";

import { type } from "os";
import { useState } from "react";
import { Game, Player, Enemy } from "@/classes/gameClasses"

export default function Menu() {

  //const { game, doPlayerTurn } = useGame()
  let p = new Player(10, 5)
  let es = [new Enemy(8)]
  const [ game, setGame ]  = useState<Game>(new Game(p, es))

  function doPlayerTurn(): void {
      
      let ng = game.clone()
      ng.player.attack(game.enemies[0]) //this reduce's enemy.hp by 1
      setGame(ng)
    }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-4">Combat</h1>
        <h1 className="font-bold mb-4">player hp: {game.player.hp}</h1>
        <h1 className="font-bold mb-4">player sp: {game.player.sp}</h1>
        <h1 className="font-bold mb-4">enemy hp: {game.enemies[0].hp}</h1>
        <div onClick={() => doPlayerTurn()}>Attack</div>
    </div>
  );
}
