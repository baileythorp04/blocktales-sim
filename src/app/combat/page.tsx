"use client";

import { type } from "os";
import { useState } from "react";
import { Game, Player, Enemy } from "@/classes/gameClasses";
import Image from "next/image";

export default function Menu() {

  //const { game, doPlayerTurn } = useGame()
  let p = new Player(10, 5)
  let es = [new Enemy(8)]
  const [ game, setGame ]  = useState<Game>(new Game(p, es))

  function doPlayerTurn(): void {
    //inputs: target, dmg, status, etc. default set to none.
    // takedamage function
      
      let ng = game.clone()
      ng.player.attack(game.enemies[0]) //this reduce's enemy.hp by 1
      setGame(ng)
    }

  return (
    <div className="container border mx-auto">
      <div className="grid grid-cols-5 border border-red-500">

        {/* This player/enemy section needs to be made into a component */}
        <div className="flex flex-col items-center">
          <div>statuses</div>
          <Image
            src="/player.png"
            alt="player"
            width={160}
            height={160}
          />

          <div>name</div>
          <div>hp/sp</div>
        </div>

        <div className="flex flex-col items-center">
          <div>statuses</div>
          <Image
            src="/enemy.png"
            alt="player"
            width={160}
            height={160}
          />

          <div>name</div>
          <div>hp/sp</div>
        </div>
        
        <div className="">asd</div>
        <div className="">asd</div>
        <div className="">asd</div>

      </div>
      <div className="flex flex-col items-center justify-center p-8">
          <h1 className="text-3xl font-bold mb-4">Combat</h1>
          <h1 className="font-bold mb-4">player hp: {game.player.hp}</h1>
          <h1 className="font-bold mb-4">player sp: {game.player.sp}</h1>
          <h1 className="font-bold mb-4">enemy hp: {game.enemies[0].hp}</h1>
          <div onClick={() => doPlayerTurn()}>Attack</div>
      </div>
    </div>
      
  );
}
