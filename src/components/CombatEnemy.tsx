import React from "react";
import Image from "next/image";
import Status from "./StatusIcon";
import { StatusEffect, StatusHolder } from "@/static/StatusHolder";
import StatusIconGroup from "./StatusIconGroup";

type CombatEnemyProps = {
  name: string,
  hp: number,
  maxHp: number,
  attack1: string,
  attack2: string,
  statusHolder: StatusHolder,
}; 

export default function CombatEnemy({ name, hp, maxHp, attack1, attack2, statusHolder }: CombatEnemyProps) {
  return (
    <div className="flex flex-col items-center">
      <StatusIconGroup statuses={statusHolder}/>
      
      <Image
        src="/enemy.png"
        alt="enemy"
        width={160}
        height={160} />
      

      <div>{name}</div>
      <div>hp: {hp}/{maxHp}</div>

      <div>
        <div>next attacks: </div>
        <div>{attack1}</div>
        <div>{attack2}</div>
      </div>
      
    </div>
  );
}