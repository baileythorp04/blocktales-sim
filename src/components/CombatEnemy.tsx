import React from "react";
import Image from "next/image";
import Status from "./StatusIcon";
import { StatusEffect, StatusHolder } from "@/static/StatusHolder";
import StatusIconGroup from "./StatusIconGroup";
import { AttackType } from "@/static/Attack";

type CombatEnemyProps = {
  name: string,
  hp: number,
  maxHp: number,
  attack1: string,
  attack2: string,
  statusHolder: StatusHolder,
  haste: boolean,
  stance?: AttackType,
}; 

export default function CombatEnemy({ name, hp, maxHp, attack1, attack2, statusHolder, haste, stance }: CombatEnemyProps) {
  return (
    <div className="flex flex-col items-center w-[160px] m-auto">
      <StatusIconGroup statuses={statusHolder}/>
      
      <Image
        src="/enemy.png"
        alt="enemy"
        width={160}
        height={160} />

        <div className="grid grid-cols-4 grid-rows-2 flex items-center w-full">

          <div className="col-start-1 row-start-1 row-span-2">
            {stance == AttackType.RANGED && <Image 
              src="/ball_stance.png"
              alt="ball stance"
              width={40}
              height={40} />}
            {stance == AttackType.MELEE && <Image 
              src="/sword_stance.png"
              alt="sword stance"
              width={40}
              height={40} />}
          </div>
        <div className="col-start-2 col-span-2 row-start-1 flex justify-center">{name}</div>
        <div className="col-start-2 col-span-2 row-start-2 flex justify-center">hp: {hp}/{maxHp}</div>
      </div>

      {haste 
      ? <div className="mt-2 ">
          <div className="flex">
            <Image className=" me-1 h-[20px]"
              src="/haste.png"
              alt="haste"
              width={20}
              height={20} />
            <div>attacks:</div>
          </div>
          <div>{attack1}</div>
          <div>{attack2}</div>
        </div>
      : <div className="mt-2">
          <div>next attack: </div>
          <div>{attack1}</div>
        </div>
      }
    </div>
  );
}