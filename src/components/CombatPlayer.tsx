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
};

export default function CombatPlayer({ hp, maxHp, sp, maxSp, statusHolder }: CombatPlayerProps) {
  return (
    <div className="flex flex-col items-center">
      <StatusIconGroup statuses={statusHolder}/>

      <Image
        src="/player.png"
        alt="player"
        width={160}
        height={160} />
      
      <div className="mt-2">hp: {hp}/{maxHp}</div>
      <div>sp: {sp}/{maxSp}</div>
      
    </div>
  );
}