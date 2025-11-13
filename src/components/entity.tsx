import React from "react";
import Image from "next/image";

type EntityProps = {
  name: string,
  isPlayer: boolean,
  hp: number
  maxHp?: number
  sp?: number
  maxSp?: number
};

export default function Entity({ name, isPlayer, hp, maxHp, sp, maxSp }: EntityProps) {
  return (
    <div className="flex flex-col items-center">
    <div>statuses</div>
    {isPlayer 
    ? <Image
      src="/player.png"
      alt="player"
      width={160}
      height={160} />
    :<Image
      src="/enemy.png"
      alt="enemy"
      width={160}
      height={160} />
    }

    <div>{name}</div>
    {isPlayer
    ? <div>
        <div>hp: {hp}/{maxHp}</div>
        <div>sp: {sp}/{maxSp}</div>
      </div>
    : <div>hp: {hp}</div>}
</div>
  );
}