import React from "react";
import Image from "next/image";

type EntityProps = {
  name: string,
  isPlayer: boolean,
  hp: number
  sp?: number
};

export default function Entity({ name, isPlayer, hp, sp }: EntityProps) {
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
        <div>hp: {hp}</div>
        <div>sp: {sp}</div>
      </div>
    : <div>hp: {hp}</div>}
</div>
  );
}