import React from "react";
import Image from "next/image";

type EntityProps = {
  name: string,
  isPlayer: boolean,
  hp: number,
  maxHp?: number,
  sp?: number,
  maxSp?: number,
  attack1?: string,
  attack2?: string,
};

export default function Entity({ name, isPlayer, hp, maxHp, sp, maxSp, attack1, attack2 }: EntityProps) {
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
    <div>hp: {hp}/{maxHp}</div>
    {isPlayer
    ? <div>sp: {sp}/{maxSp}</div>
    : <div>
        <div>next attacks: </div>
        <div>{attack1}</div>
        <div>{attack2}</div>
      </div>}
</div>
  );
}