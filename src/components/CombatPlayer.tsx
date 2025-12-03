import React from "react";
import Image from "next/image";
import Status from "./StatusIcon";
import { StatusEffect, StatusHolder } from "@/static/StatusHolder";
import StatusIconGroup from "./StatusIconGroup";

type CombatPlayerProps = {
  hp: number,
  maxHp: number,
  sp: number,
  maxSp: number,
  statusHolder: StatusHolder,
  atkBoost: number,
  armor: number
};

export default function CombatPlayer({ hp, maxHp, sp, maxSp, statusHolder, atkBoost, armor }: CombatPlayerProps) {
  debugger
  return (
    <div className="flex flex-col items-center">
      <StatusIconGroup statuses={statusHolder}/>

      <Image
        src="/player.png"
        alt="player"
        width={160}
        height={160} />

      <div className="w-[160px] grid grid-cols-4 grid-rows-1">
        <div className="col-start-1 flex flex-col items-center">
          
          

          {atkBoost != 0 &&
            <div className="mt-1 relative inline-block w-[40px] h-[40px]">
              <Image 
                src="/atk.png"
                alt="atk icon"
                width={40}
                height={40} />
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg drop-shadow-lg/100">
                {atkBoost}
              </div>
            </div>
          }

          {armor > 0 &&
            <div className="mt-1 relative inline-block w-[40px] h-[40px]">
              <Image 
                src="/armor.png"
                alt="armor icon"
                width={40}
                height={40} />
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg drop-shadow-lg/100">
                {armor}
              </div>
            </div>
          }
        </div>

        <div className="col-start-2 col-span-2 flex flex-col items-center">
          <div className="mt-2">hp: {hp}/{maxHp}</div>
          <div>sp: {sp}/{maxSp}</div>
        </div>
      </div>
      
    </div>
  );
}